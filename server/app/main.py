import os
from configuration import configuration_by_name
from dotenv import load_dotenv
from flask import Flask, request
from flask_cors import CORS
from factory.controller_factory import signature_controller_factory, heartbeat_controller_factory


dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)
env = os.environ.get('ENV', 'production')

app = Flask(__name__)
CORS(app)
app.config.from_object(configuration_by_name[env])

signature_controller = signature_controller_factory()
heartbeat_controller = heartbeat_controller_factory()


@app.route('/heartbeat', methods=['GET'])
def heartbeat():
    return heartbeat_controller.heartbeat(request=request)


@app.route('/signatures/create', methods=['POST'])
def create():
    return signature_controller.create(request=request)


if __name__ == '__main__':
    app.run()
