import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Configuration:
    DEBUG = False


class DevelopmentConfiguration(Configuration):
    DEBUG = True


class ProductionConfiguration(Configuration):
    DEBUG = False


configuration_by_name = dict(
    development=DevelopmentConfiguration,
    production=ProductionConfiguration
)
