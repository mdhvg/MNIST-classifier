from flask import Flask
from flask import render_template
from flask_sock import Sock
import torch
from model import net
import cv2
import numpy as np
import json

app = Flask(__name__)
sock = Sock(app)


@sock.route("/")
def echo(sock):
    while True:
        data = sock.receive()
        data = json.loads(data)
        data = cv2.GaussianBlur(np.array(data), (1, 1), 0)
        data = torch.Tensor(data)
        data = data.view(1, 1, 28, 28)
        with torch.no_grad():
            sock.send(net(data).tolist()[0])


@app.route("/")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
