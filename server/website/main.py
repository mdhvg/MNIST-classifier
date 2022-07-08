from flask import Flask
from flask import render_template
from flask_sock import Sock
import torch
from model import net

app = Flask(__name__)
sock = Sock(app)

@sock.route('/')
def echo(sock):
    while True:
        data = sock.receive()
        data = data.replace("[", "").replace("]", "")
        data = data.split(",")
        data = [int(i) for i in data]
        data = torch.Tensor(data)
        with torch.no_grad():
            sock.send(net(data).tolist())

@app.route("/")
def home():
    return render_template("index.html")


if __name__=='__main__':
    app.run(debug=True)