import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

df=pd.read_csv("./data.csv")

x=df[['Height_cm']]
y=df[['Shoe_Size_US']]

x_train,x_test,y_train,y_test=train_test_split(x,y,test_size=0.2)
scaler=StandardScaler()

x_train_scaled=scaler.fit_transform(x_train)
x_test_scaled=scaler.transform(x_test)

LR=LinearRegression()
LR.fit(x_train_scaled,y_train)

def predict(x:int):
    array=[[x]]
    size=LR.predict(scaler.transform(array))
    for x in size:
        for y in x:
            return y
