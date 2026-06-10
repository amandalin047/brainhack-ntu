# BrainHack Taiwan–Singapore 2026 Course Materials and Infrastructure

Based on the supplementary code, notebooks, and infrastructure scripts developed for BrainHack Taiwan–Singapore, this repository highlights research-engineering skills through reproducible ML experiments, manual validation of library internals, neuroimaging workflows, and automation of course-scale data infrastructure. The materials cover **machine learning, deep learning, MNE-Python EEG analysis, BIDS workflows, and course administration automation.**

## Purpose

This repository was created to support teaching, debugging, and course infrastructure for BrainHack Taiwan–Singapore. Many examples are designed to expose the mechanics behind common machine learning, deep learning, and neuroimaging workflows, especially in cases where high-level libraries hide important implementation details.

The code emphasizes reproducibility, explicit validation, and methodological transparency. In several places, built-in library behavior is manually replicated or inspected to make the underlying computations easier to understand.

## Repository Structure

```text
.
├── machine_learning/
├── deep_learning/
├── mne_eeg/
├── workshop_2025/
└── admin/
```

## `machine_learning/`

This folder contains basic to intermediate, and early-advanced, machine learning materials.

Topics include:

- K-nearest neighbors
- Logistic regression
- Linear regression
- Bias–variance trade-off
- Code examples and mathematical decomposition of bias and variance
- Cross-validation
- Nested cross-validation
- Bayesian mixture models
- Support vector machines
- Support vector regression
- Optimization and KKT-based derivations for SVM/SVR

The emphasis is on connecting machine learning implementation with the underlying mathematical and statistical ideas, rather than treating models as black-box API calls.

## `deep_learning/`

This folder contains deep learning examples for trial-level classification using single-subject fMRI connectivity data.

Topics include:

- A one-layer neural network using a linear layer followed by softmax
- Comparison between a manually trained one-layer neural network and logistic regression
- Keras implementation with a manual training loop
- Multi-layer perceptrons in both PyTorch and Keras
- Nested cross-validation for hyperparameter tuning
- Learning rate, dropout, and weight decay tuning
- Early stopping

The goal is to make the training mechanics explicit, including forward passes, loss computation, optimization, and validation-based model selection.

## `mne_eeg/`

This folder contains in-depth explorations of the MNE-Python API and EEG analysis workflows.

Topics include:

- MNE-Python API exploration
- Manual implementation of power spectral density analysis using SciPy FFT and Matplotlib
- Replication of MNE built-in PSD plots using lower-level numerical tools
- Manual verification of MNE ICA projection matrices
- Comparison between MNE ICA internals and PCA-style matrix operations from scikit-learn
- Manual verification of orthogonal projections in MNE SSP internals
- BIDS-oriented EEG data handling and tutorial materials

The focus is on understanding what MNE is doing internally, rather than only using high-level function calls.

## `workshop_2025/`

This folder contains materials related to EEG modeling based on the NeurIPS 2025 EEG Challenge starter kit.

Topics include:

- EEG encoder implementation using EEGNeX
- Starter-kit-based EEG modeling workflows
- Custom EEGLAB export functions
- Event handling
- Annotation processing

These materials are intended for exploring EEG decoding/modeling workflows and improving interoperability between EEG analysis tools.

## `admin/`

This folder contains course infrastructure and administrative automation scripts.

Contents include:

- Google Apps Script code for course system automation
- Submission handling scripts
- Grading workflow automation
- Google Sheets automation
- Python scripts for final presentation scheduling
- Constraint-satisfaction-style scheduling logic for assigning presentation slots under availability constraints

This folder is primarily intended for reproducible course administration, reducing manual spreadsheet work, and documenting the infrastructure behind the course workflow.

## Notes

Some materials are educational or exploratory rather than polished software packages. The repository includes notebooks and scripts developed to clarify implementation details, verify library behavior, and support teaching/debugging during the course.

Where applicable, student-identifying information has been removed or pseudonymized before public release.
