import sys
import numpy
import pandas
import matplotlib.pyplot as plt

from keras.layers import Dense, LSTM
from keras.models import Sequential
from sklearn.metrics import mean_squared_error

from sklearn.preprocessing import MinMaxScaler

from tqdm import trange


# For reproducibility
# numpy.random.seed(10)


def load_dataset(filename: str) -> (numpy.ndarray, MinMaxScaler):

    """
    The functions focuses on loading the dataset and then normalising the
    loaded data

    :paramaters 
    - filename: filename of the file to load

    :return:
    - a dataset as a tuple 
    - the MinMaxScaler object to be used
    """

    # Loads the datasource passed in into a dataframe
    dataframe = pandas.read_csv(filename, usecols=[1])
    dataframe = dataframe.fillna(method='pad')

    # Transforms data frame into a working dataset of float
    dataset = dataframe.values
    dataset = dataset.astype('float32')

    # Proceeds to then normalize the dataset
    mmscale = MinMaxScaler(feature_range=(0, 1))
    dataset = mmscale.fit_transform(dataset)

    return dataset, mmscale

def split_dataset(dataset: numpy.ndarray, training_size, look_back) -> (numpy.ndarray, numpy.ndarray):

    """
    Splits dataset into training and test datasets. The last `look_back` rows in train dataset
    will be used as `look_back` for the test dataset.

    :parameters 
    - dataset: the original dataset
    - training_size: specifies the size to be used for the training data
    - look_back: The number of previous time steps

    :return
    - tuple of x for training or test dataset
    - tuple of y for training or test dataset
    """

    if not training_size > look_back:
        raise ValueError('training_size must be larger than the look_back size')

    train, test = dataset[0:training_size, :], dataset[training_size - look_back:len(dataset), :]
    #print('train_dataset: {}, test_dataset: {}'.format(len(train), len(test)))

    return train, test


def create_dataset(dataset: numpy.ndarray, look_back: int=1) -> (numpy.ndarray, numpy.ndarray):

    """
    This function uses the dataset and the look back (number of previous steps as input variables), 
    which calculates the next time period. 

    :parameter:
    - dataset: the dataset
    - look_back: number of previous steps as input variables (Int)

    :return: 
    - tuple creating input and output set
    """
    data_x, data_y = [], []

    # Append the dataset
    for i in range(len(dataset)-look_back-1):
        a = dataset[i:(i+look_back), 0]
        data_x.append(a)
        data_y.append(dataset[i + look_back, 0])

    return numpy.array(data_x), numpy.array(data_y)



def build_model(look_back: int, batch_size: int=1) -> Sequential:

    """
    The function builds a keras Sequential model

    :parameters
    - look_back: The number of previous time steps
    - batch_size: The batch size to use

    :return: 
    - A Sequential Model object for Keras
    """
    model = Sequential()
    model.add(LSTM(64,
                   activation='relu',
                   batch_input_shape=(batch_size, look_back, 1),
                   stateful=True,
                   return_sequences=False))
    model.add(Dense(1, activation='linear'))
    model.compile(loss='mean_squared_error', optimizer='adam')
    return model


def generate_forecast(model: Sequential, look_back_buffer: numpy.ndarray, timesteps: int=1, batch_size: int=1):

    """
    The function generates the final prediction forecase

    :parameter 
    - model: A Sequential Model object for Keras
    - look_back_buffer: The buffer containing the look back values
    - timesteps: The timestep to use (default 1)
    - batch_size: The batch size to use (default 1)

    :return: 
    - The forecast prediction
    """

    forecast_predict = numpy.empty((0, 1), dtype=numpy.float32)

    for _ in trange(timesteps, desc='predicting data\t', mininterval=1.0):

        # Use the lookback buffer in order to make a prediciton
        cur_predict = model.predict(look_back_buffer, batch_size)

        # Sum the predicition and the result
        forecast_predict = numpy.concatenate([forecast_predict, cur_predict], axis=0)

        # Reshape using new axis
        cur_predict = numpy.reshape(cur_predict, (cur_predict.shape[1], cur_predict.shape[0], 1))

        # Eliminate the oldest prediction from the buffer
        look_back_buffer = numpy.delete(look_back_buffer, 0, axis=1)

        # The the buffer and concatenate it with the latest prediciton
        look_back_buffer = numpy.concatenate([look_back_buffer, cur_predict], axis=1)

    return forecast_predict

def plot_data(dataset: numpy.ndarray, look_back: int, training_prediction: numpy.ndarray,
              test_predict: numpy.ndarray, forecast_predict: numpy.ndarray):

    """
    Plots the dataset line and the prediction line


    :paramaters 
    - dataset: the original dataset used
    - look_back: the amount of previous time steps
    - training_prediction: the predicted values from the training
    - test_predict: the predicted values from the testing
    - forecast_predict: prediction based on all previous predictions
    """
    axes = plt.gca()

    # Sets the axis title
    plt.title('Predicted Marks Average')
    plt.ylabel('Student Mark')

    # Set the ticks for the y axis and remove x ticks
    axes.set_ylim([0,100])
    plt.yticks([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
    axes.set_xticklabels([])

    # Plot the original dataset
    plt.plot(dataset, 'b', label='Received Marks Dataset')
    plt.legend(loc='best')

    for x in forecast_predict:
        if x > 100:
            x = 100

    # Plot the prediction line onto the graph
    plt.plot([None for _ in range(look_back)] +
             [None for _ in training_prediction] +
             [None for _ in test_predict] +
             [x for x in forecast_predict], 'r', label='Marks Prediction Line')
    plt.legend(loc='best')

    for x in forecast_predict:
        if x < 50 and sys.argv[2] == "1":
            print("Student failure possibility")
            break

    plt.axhline(y=50, color='k', linestyle='--', label='50 Percent Line')
    plt.legend(loc='best')

    # Draw the final plot
    plt.savefig("./graphs/" + sys.argv[3] + ".png")
    # plt.show()

def main():

    # Sends of data to be loaded
    filename = "./data/" + sys.argv[1]
    dataset, mmscale = load_dataset(filename)

    # Split the data into the training and test sets (20% into the look back and 70* into the training set)
    look_back = int(len(dataset) * 0.20)
    training_size = int(len(dataset) * 0.70)

    # Call the data split
    train, test = split_dataset(dataset, training_size, look_back)

    # Reshaping and creating the datasets ( X = t and Y = t + 1 for the LSTM )
    train_x, train_y = create_dataset(train, look_back)
    test_x, test_y = create_dataset(test, look_back)

    # Use numpy to reshape the input to the format [samples, time steps, features]
    train_x = numpy.reshape( train_x, (train_x.shape[0], train_x.shape[1], 1) )
    test_x = numpy.reshape( test_x, (test_x.shape[0], test_x.shape[1], 1) )

    # Create the  Multilayer Perceptron Model and fit it
    batch_size = 1
    model = build_model(look_back, batch_size=batch_size)
    for _ in trange(100, desc='fitting model\t', mininterval=1.0):
        model.fit(train_x, train_y, nb_epoch=1, batch_size=batch_size, verbose=0, shuffle=False)
        model.reset_states()

    # Get the predictions for the training
    training_prediction = model.predict(train_x, batch_size)
    test_predict = model.predict(test_x, batch_size)

    # Complete the general forecasting to create the prediction results to display
    forecast_predict = generate_forecast(model, test_x[-1::], timesteps=100, batch_size=batch_size)

    # Invert all datasets and predictions
    dataset = mmscale.inverse_transform(dataset)
    training_prediction = mmscale.inverse_transform(training_prediction)
    train_y = mmscale.inverse_transform([train_y])
    test_predict = mmscale.inverse_transform(test_predict)
    test_y = mmscale.inverse_transform([test_y])
    forecast_predict = mmscale.inverse_transform(forecast_predict)

    # Get the root mean square (For testing)
    #train_score = numpy.sqrt(mean_squared_error(train_y[0], training_prediction[:, 0]))
    #print('Train Score: %.2f RMSE' % train_score)
    #test_score = numpy.sqrt(mean_squared_error(test_y[0], test_predict[:, 0]))
    #print('Test Score: %.2f RMSE' % test_score)

    plot_data(dataset, look_back, training_prediction, test_predict, forecast_predict)

if __name__ == '__main__':
    main()
