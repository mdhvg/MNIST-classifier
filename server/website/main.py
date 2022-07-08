from flask import Flask
from flask import render_template
from flask_sock import Sock

app = Flask(__name__)
sock = Sock(app)

@sock.route('/')
def echo(sock):
    while True:
        data = sock.receive()


@app.route("/")
def home():
    return render_template("index.html")


if __name__=='__main__':
    app.run(debug=True)