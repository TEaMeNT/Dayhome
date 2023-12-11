import json
from flask import Blueprint, request, render_template, session
import sqlite3
import os

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route("/api/api_get_daily_lessons", methods=['GET', 'POST'])
def api_get_daily_lessons():
    db = sqlite3.connect('bases/DB.db')
    cur = db.cursor()
    schedule = cur.execute(f'''SELECT * FROM Schedule''').fetchall()
    dict = {}
    for day in schedule:
        a = day[2:] + (day[0], )
        if(day[1] in dict.keys()):
            dict[day[1]].append(a)
        else:
            dict[day[1]] = [a]
    cur.close()
    db.close()
    return json.dumps(dict)

@api_blueprint.route("/api/homework_upd", methods=['GET', 'POST'])
def homework_upd():
    if request.method == "POST":
        db = sqlite3.connect('bases/DB.db')
        cur = db.cursor()
        homework = json.loads(request.data)
        print(homework)
        cur.execute('INSERT INTO days (day, home_work) VALUES (?, ?)', (homework[0], homework[1]))
        db.commit()
        cur.close()
        db.close()
    return ''

@api_blueprint.route("/api/get_day_homework", methods=['GET', 'POST'])
def get_day_homework():
    day = json.loads(request.data)
    db = sqlite3.connect('bases/DB.db')
    cur = db.cursor()
    homework = []
    for i in range(day[1]):
        hm = cur.execute(f'''SELECT home_work FROM days WHERE day = "{day[0] + " " + str(i)}"''').fetchall()
        if (hm != []):
            homework += [[i, hm]]
    cur.close()
    db.close()
    return json.dumps(homework)

#os.chdir("../")
@api_blueprint.route("/api/get_files_list", methods=['GET', 'POST'])
def get_files_list():
    main_dir = os.path.abspath(os.getcwd()) + "/static/files/"
    directories = [d for d in os.listdir(main_dir)]
    files_list = []
    for dir in directories:
        files_dir = main_dir + "/" + dir + "/"
        files = [dir]
        files += [f for f in os.listdir(files_dir)]
        files_list += [files]
    
    return json.dumps(files_list)

@api_blueprint.route("/api/skip_upd", methods=['GET', 'POST'])
def skip_upd():
    if request.method == "POST":
        db = sqlite3.connect('bases/DB.db')
        cur = db.cursor()
        skip = json.loads(request.data)
        print(skip)
        cur.execute(f'UPDATE Schedule SET skip = {skip[1]} WHERE id = {skip[0]}')
        db.commit()
        cur.close()
        db.close()
    return ''
