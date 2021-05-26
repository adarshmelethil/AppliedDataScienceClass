FROM jupyter/datascience-notebook:1386e2046833

RUN conda update -n base conda

RUN conda update --all
RUN conda update jupyterlab jupyterhub
