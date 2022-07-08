from flask import Flask
from flask import render_template
from flask_sock import Sock
import torch
from model import net
import cv2
import numpy as np

app = Flask(__name__)
sock = Sock(app)

@sock.route('/')
def echo(sock):
    while True:
        data = sock.receive()
        try:
            data = data.replace("[", "").replace("]", "")
            data = data.split(",")
            data = [float(i) for i in data]
            data = cv2.GaussianBlur(np.array(data), (3,3),0)
            print(data.shape)
            data = torch.Tensor(data)
            with torch.no_grad():
                sock.send(net(data).tolist())
        except Exception as e:
            print(e)
            sock.send("")

@app.route("/")
def home():
    return render_template("index.html")


if __name__=='__main__':
    app.run(debug=True)