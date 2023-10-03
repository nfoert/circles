# Contributing
Here's a brief explanation on how to contribute if you're new here.
1. Press the `Fork Repo` button. This creates a copy of the repo for you to edit.
2. Run the `git clone https://<username>/<name of forked repo>` command on your computer to download the files for you to edit
3. Create a virtual enviroment with `python -m venv <name of venv>` and activate it with the command for your system.
4. Install the required packages with `pip install -r requirements.txt`
5. Move to the directory using `cd circles`
6. Migrate changes using `python manage.py makemigrations && python manage.py migrate`
7. Run the server using `python manage.py runserver` (Or if you're using vscode, use the included task in `tasks.json`)
8. Make changes to the project.
9. Commit your changes to your fork
10. On the GitHub page for your fork, press the `Contribute` button. Select the branch and commits to merge.
11. Write comments about what you changed in the project.
12. Create your pull request. I'll review the changes and make necessary adjustments before approving your changes.
13. Thank you! <3
