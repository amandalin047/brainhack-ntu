### Python via Homebrew 
Homebrew is a convenient, widely used package manager for macOS. Therefore, many people install Python via Homebrew. However, Python installed this way could potentially have issues with the package _Tkinter_, which is the standard Python GUI toolkit. As such, it's recommended to install Python via `pyenv`, especially if one needs to manage different Python versions due to project dependencies. Nonetheless, for the purposes of this course, Python via Homebrew won't be a problem. **This page assumes that your device already has Homebrew installed**.

Run the following lines **one line at a time** in the terminal to install Python 3.11, create a virtual environment, and several packages that are useful for data analysis :
```
brew update && brew upgrade
brew install python@3.11
```

### Python packages via PIP
Now type
```
python3.11 -m pip list
```
to see the packages installed by PIP, which in this case are probably just `pip` itself and `setuptools`. We want to install a package called `virtualenv` to create a virtual environment as mentioned in the beginning, so run
```
python3.11 -m pip install virtualenv
```
After installation, create a folder called `erpclass`, go to that folder, and install relevant packages
```
mkdir erpclass; cd erpclass
python3.11 -m virtualenv venv
source venv/bin/activate
pip install jupyterlab mne pandas pingouin openpyxl flake8
```
- **[MNE](https://mne.tools/stable/index.html) is the Python package for reading, processing, analyzing, and plotting EEG/MEG data.**
- [Pandas](https://pandas.pydata.org/docs/) is a powerful library for data analysis and data manipulation in the form of `pandas.DataFrame`
- [Pingouin](https://pingouin-stats.org/build/html/index.html) is for statistical analyses in Python (I find it more convenient than Statsmodels, which comes installed as a dependency with MNE.
- [Openpyxl](https://openpyxl.readthedocs.io/en/stable/) is needed in order for Python to read from and write to Excel files.
    + Side note: Excel now accepts (or is about to accept) Python syntax and functions 😍
- [Flake8](https://flake8.pycqa.org/en/latest/) is basically Grammerly for Python.

After it's done, type `python3.11 -m pip list` again. You should now see a long list of packages installed.

### Opening Jupyter Lab
No we're ready to open your Jupyter Lab! Type
```
jupyter lab
```
which will automatically open a browser tab (if it doesn't, copy and paste any one of the URLs, e.g., `http:/localhost:blahblahblah` into your browser search bar), and voila! There's your Jupyter Lab! Note also that you do not need the internet to run Jupyter; localhost refers to your device. 

Last step, open a Jupyter notebook and paste the following lines into the first cell, then hit Run:
```
import mne
import numpy as np
from platform import python_version
python_version()
```
There should be no errors, and 3.11.5 will be the output.

### Deactivating virtual environments
To deactivate a virtual environment, simply type
```
deactivate
```
in the terminal. In addition, if you now type
```
pip3 list
```
after `venv` has been deactivated, you won't see any of the packages we just installed after `virtualenv`.
