# Software Installation: Python 3.11 and Related Packages for ML + EEG
Python installation depends on your OS (operating system). As there's quite a bit of shell language involved in the set-up, here I also introduce two alternatives:
- A user-friendly Python and R distribution plus package manager, _Anaconda_. 
- A cloud-based alternative, _Google Colab_, which should be sufficient for the purposes of this course. That being said, configuring your own Python environment is still encouraged.

Sections:
- [Windows](#windows)
- [MacOS](#macos)

## Windows
### Check for installed Pythons
In the Windows start menu search bar, type `Python` to see which versions you have installed. If it's already 3.11, skip to section [Python packages via PIP](#python-packages-via-pip); if not, read on to install Python 3.11

### Python 3.11 official installer
Go the the [official Python website](https://www.python.org/downloads/release/python-3115/). Select "Windows installer 64-bit" (if an error occurs and the installation fails, your devic is on a 32-bit processor, so switch to "Windows installer 32-bit"). After the installer file has been downloaded, double-click on the file to run it. In the pop out window, check off ☑️ "Install launcher for all users (recommended)" and ☑️ "Add Python 3.11 to PATH", then click "Install Now".

<img src="https://github.com/amandalin047/brainhack-ntu/blob/installation/screenshots/screenshot1.png" alt="Python Intsaller for Windows" width="300">

Launch your PowerShell, type
```
py --list
```
to show the Python versions that you have installed (and have been added to PATH). You should at least see 3.11.
- 💡 To launch PowerShell, type "powershell" in the Windows start menu search bar and click on the PowerShell icon; if you're on Windows 11, press the Windows key and X.

### Python packages via PIP
In the PowerShell, type
```
py -3.11 -m pip list
```
to see all the packages installed by PIP. If your Python 3.11 has just been installed, you'll only see `pip` itself and `setuptools`. In the following steps, we'll install a package called `virtualenv` to create a virtual environment:
```
py -3.11 -m pip install virtualenv
```
After installation, create a new folder called `brainhack-ntu`, **put `talk-12-06-2025.ipynb` and `requirements.txt` in `brainhack-ntu` at the top level**, then inside the terminal, we'll go to that folder, create a virtual environment named `mleeg`, and install relevant packages by executing the commands below one line at a time:
```
cd brainhack-ntu
py -3.11 -m virtualenv mleeg
mleeg\Scripts\activate
pip install -r requirements.txt
```
- [MNE](https://mne.tools/stable/index.html) is the Python package for reading, processing, analyzing, and plotting EEG/MEG data.
- [PyTorch]() is 
- [EEGDash]() is
- [Braindecode]() is
- [Pandas](https://pandas.pydata.org/docs/) is a powerful library for data analysis and data manipulation in the form of `pandas.DataFrame`
- [Openpyxl](https://openpyxl.readthedocs.io/en/stable/) is needed in order for Python to read from and write to Excel files.
    + Side note: Excel now accepts (or is about to accept) Python syntax and functions.
- ⚠️ In the third line, if you encounter an error related to execution policies, launch a new PowerShell window and **run as the administrator**. Type
```
Set-ExecutionPolicy Unrestricted 
```
then type
```
cd C:\Users\<your_user_name>\brainhack-ntu; mleeg\Scripts\activate
```
(change `<your_user_name>` to your actual device user name)
to see if the error gets resolved. If so, proceed to the fourth line
```
pip install -r requirements.txt
```
- ⚠️ In the fourth line, if `pip` doesn't work, perhaps try `py -m pip`.

After it's done, type `pip list` (or `py -m pip list`) again. You should now see a long list of packages installed.

<img src="https://github.com/amandalin047/brainhack-ntu/blob/installation/screenshots/screenshot2.png" alt="Python packes via PIP" width="700">

### Opening Jupyter Lab
No we're ready to open your Jupyter Lab! Type
```
jupyter-lab
```
which will automatically open a browser tab (if it doesn't, copy and paste any one of the URLs, e.g., `http:/localhost:blahblahblah` into your browser search bar), and voila! There's your Jupyter Lab! Note also that you do not need the internet to run Jupyter; localhost refers to your device. 

Last step, open a new Jupyter notebook (in the Launcher, select "Pytnon 3 ipython kernel") and paste the following lines into the first cell, then hit Run:
```
import mne
import numpy as np
import torch
import eegdash
import braindecode
import pandas
import sklearn
import joblib
from platform import python_version
python_version()
```
There should be no errors, and 3.11.5 will be the output.

<img src="https://github.com/amandalin047/brainhack-ntu/blob/installation/screenshots/screenshot9.png" alt="pyenv init" width=400>

### Deactivating virtual environments
To deactivate a virtual environment, simply type
```
deactivate
```

### Final note
Suppose you've closed your terminal and wish to relaunch it, you have to go to the `brainhack-ntu` folder and _activate_ `mleeg`, after which you may then launch Jupyter:
```
cd brainhack-ntu
mleeg/Scripts/activate
jupyter lab
```

## MacOS
### Pre-installed Python
Since most macOS computers come with Python pre-installed (please do not modify your mac's pre-installed Python as it would mess with your system), it's always a good practice to check which Python version you have on your device. Go to your terminal and type `python --version` which probably isn't 3.11.5. The steps below will install the latest Python release and a virtual environment for better package version/dependency management.
- 💡 To launch the mac terminal, click on the Launchpad icon in the Dock, type `Terminal` in the search field, then click Terminal.
- 💡 Apple installs Python in `usr/bin/`, so don't touch anything related to Python in that directory!!!

### Install Xcode Command Line Tools
Check if they're installed:
```
xcode-select --version
```
If they are, you'll get the corresponding version in your terminal output; if not, run
```
xcode-select --install
```
which will pop out a window asking you to install them. Click Install, and wait. You will then see a message display
> The software was installed.

Click Done, and type 
```
xcode-select -p
```
in the terminal, which should output
> /Library/Developer/CommandLineTools

### Install Homebrew
In the terminal, type
```
brew --version 
```
to see if Homebrew is installed on your mac. If an error occurs, it is not installed. Type the following command to install Homebrew:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
After installation, type
```
brew doctor
```
to check that everything's okay.
- 💡 For an alternative way to install Python with less terminal code involved, please refer to [this page](https://github.com/amandalin047/brainhack-ntu/blob/installation/Appendix_A.md).

### Install `pyenv` via Homebrew 

After Homebrew has been installed, run the following lines one line at a time in the terminal to install Python 3.11.5 and the packages we'll be using in class, along with several others I find useful for data analysis:
```
brew update && brew upgrade
brew install pyenv
```

After installation, run
```
pyenv init
```
<img src="https://github.com/amandalin047/brainhack-ntu/blob/installation/screenshots/screenshot3.png" alt="pyenv init" width=400>

and look at the terminal output carefully; follow the instruction there, i.e.,  copy and paste the listed lines to your corresponding files, which in my case are `~/.bashrc` and `~/.profile` as I'm running Ubuntu in Windows Subsystem for Linux. Remember to save, then _source_ the files or _close and restart_ your terminal for the changes to take effect. 
- 💡 If you've never modified such files and are lost at this step, feel free to screenshot what `pyenv init` outputs and [email me](https://docs.google.com/document/d/1JBO6eFAZ6MM8P9p1YiCILFfPHe5p0GV_/edit?usp=sharing&ouid=103533581234587701878&rtpof=true&sd=true) the picture.

## Python via `pyenv`
It's recommended to install build depedndencies before installing any Python version, so execute the following:
```
brew install openssl readline sqlite3 xz zlib tcl-tk
```
Now install Python 3.11.5 using pyenv (this may take a while):
```
pyenv install 3.11.5
```

Set Python to the newly installed version:
```
pyenv global 3.11.5
```

Type
```
which python
```
which should output something like 
> blahblahblah/.pyenv/shims/python

And typing
```
python --version
```
should get you the desired 3.11.5

### Python packages via PIP
Now type
```
pip3 list
```
to see the packages installed by PIP, which in this case are probably just `pip` itself and `setuptools`. We want to install a package called `virtualenv` to create a virtual environment as mentioned in the beginning, so run
```
pip3 install virtualenv
```

After installation, create a new folder called `brainhack-ntu`, **put `talk-12-06-2025.ipynb` and `requirements.txt` in `brainhack-ntu` at the top level**, then inside the terminal, we'll go to that folder, create a virtual environment named `mleeg`, and install relevant packages by executing the commands below one line at a time:
```
cd brainhack-ntu
virtualenv mleeg
mleeg\Scripts\activate
pip install -r requirements.txt
```
- [MNE](https://mne.tools/stable/index.html) is the Python package for reading, processing, analyzing, and plotting EEG/MEG data.
- [PyTorch](https://pytorch.org) is 
- [EEGDash](https://eegdash.org/index.html) is
- [Braindecode](https://braindecode.org/stable/index.html) is
- [Pandas](https://pandas.pydata.org/docs/) is a powerful library for data analysis and data manipulation in the form of `pandas.DataFrame`
- [Openpyxl](https://openpyxl.readthedocs.io/en/stable/) is needed in order for Python to read from and write to Excel files.
    + Side note: Excel now accepts (or is about to accept) Python syntax and functions.

After it's done, type `pip3 list` again. You should now see a long list of packages installed.

### Opening Jupyter Lab
No we're ready to open your Jupyter Lab! Type
```
jupyter lab
```
which will automatically open a browser tab (if it doesn't, copy and paste any one of the URLs, e.g., `http:/localhost:blahblahblah` into your browser search bar), and voila! There's your Jupyter Lab! Note also that you do not need the internet to run Jupyter; localhost refers to your device. 

Last step, open a new Jupyter notebook (in the Launcher, select "Pytnon 3 ipython kernel") and paste the following lines into the first cell, then hit Run:
```
import mne
import numpy as np
import torch
import eegdash
import braindecode
import pandas
import sklearn
import joblib
from platform import python_version
python_version()
```
There should be no errors, and 3.11.5 will be the output.

<img src="https://github.com/amandalin047/brainhack-ntu/blob/installation/screenshots/screenshot9.png" alt="pyenv init" width=400>

### Deactivating virtual environments
To deactivate a virtual environment, simply type
```
deactivate
```
in the terminal. In addition, if you now type
```
pip3 list
```
after `mleeg` has been deactivated, you won't see any of the packages we just installed after `virtualenv`.

### Final note
Suppose you've closed your terminal and wish to relaunch it, you have to go to the `brainhack-ntu` folder and _activate_ `mleeg`, after which you may launch Jupyter:
```
cd brainhack-ntu
source mleeg/bin/activate
jupyter lab
```
