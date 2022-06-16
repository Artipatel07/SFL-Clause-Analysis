/**
 *Conatins all api call functions
 *Grading, Tree constructing, Teachers Tree retreval
 *Saving and retrieving from database
 *
 *
 */

var port = "http://192.168.1.10:8000/"

updateTeacher = function() {
    return new Promise(function(resolve, reject) {
        $.post(
            port2 + "teacherSFLTrees", {},
            function(data) {
                resolve(data);
            }
        );
    });
}

getGrade = function(body, sfl_tree) {
    var grade;
    return new Promise(function(resolve, reject) {
        $.post(
            port2 + "SFL_Draw/grading", {
                body,
                sfl_tree
            },
            function(data_) {
                resolve(data_);
            }
        );
    });
}

getGradeTable = function(studentAnswer, teacherAnswer) {
    var grade;
    console.log(studentAnswer)
    return new Promise(function(resolve, reject) {
        $.post(
            port2 + "SFL_Draw/gradingTable", {
                studentAnswer,
                teacherAnswer
            },
            function(data_) {
                resolve(data_);
            }
        );
    });
}

getTree = function() {
    var nodes;
    var res;
    return new Promise(function(resolve, reject) {
        $.post(
        port + "treetest", {
                body
            },
            function(data) {
                var res = JSON.stringify(data).slice(1, -1).replace(/\\/g, "");
                nodes = JSON.parse(res);
                resolve(nodes);
            }
        );
    });
}

getTeacherSFL = function(sentence) {
    var sfl = sentence;
    return new Promise(function(resolve, reject) {
        $.post(
            port2 + "exampleTrees", {
                sfl
            },
            function(data) {
                var res = JSON.stringify(data).slice(1, -1).replace(/\\/g, "");
                //nodes = JSON.parse(res);
                resolve(res);
            }
        );
    });
}

getTeacherSFL_db = function() {
    return new Promise(function(resolve, reject) {
        $.get(
            port2 + "mydb",
            function(data) {
                //var res = data;
                resolve(data);
            }
        );
    });
}

getStudentSFL_db = function(userid) {
    return new Promise(function(resolve, reject) {
        userid = userid.replace('s', '');
        $.get(
            port2 + "mydb_s/" + userid,
            function(data) {
                resolve(data);
            }
        );
    });
}

getTableSolution = function() {
    return new Promise(function(resolve, reject) {
        $.post(
            port2 + "SFL_Draw/getSolutions", {
                AssignmentId: assignment._id,
            },

            function(data) {
                resolve(data);
            }
        );
    });
}



getStudentAttempt = function() {
    return new Promise(function(resolve, reject) {
        $.post(
            port2 + "SFL_Draw/getMyAttempt", {
                AssignmentId: assignment._id,
            },

            function(data) {
                resolve(data);
            }
        );
    });
}


getAllStudentTables_db = function() {
    return new Promise(function(resolve, reject) {
        $.get(
            port2 + "mydb_s_a",
            function(data) {
                //var res = data;
                resolve(data);
            }
        );
    });
}

/*Post commands*/
postToStudent = function(object) {
    console.log(object);

    return new Promise(function(resolve, reject) {
        $.post(
            port2 + "student", {
                id: object.id,
                user: object.user,
                file: object.file,
                value: object.value,
                connection_type: object.connection_type,
            },

            function(data) {
                var res = data;
                resolve(res);
            }
        );
    });
}

postToTeacher = function(object) {
    //console.log(object);

    return new Promise(function(resolve, reject) {
        $.post(
            port2 + "teacher", {
                key: object.key,
                id: object.id,
                value: "[" + object.value + "]",
                connection_type: object.connection_type,
            },

            function(data) {
                var res = data;
                resolve(res);
            }
        );
    });
}

save_session = function(object) {
    console.log(object);
    return new Promise(function(resolve, reject) {
        $.post(
            port2 + "mydb_save", {
                id: object.id,
                collection: object.collection,
                last_session: object.last_session
            },
            function(data) {
                resolve(data);
            }
        );
    });
}


SaveAnswersInDB = function(object) {
    if ((assignment.Complete && user.role == 'Teacher' && isEditing) || (assignment.Complete == 'false')) {
        return new Promise(function(res, rej) {
            $.post(
                port2 + "SFL_Draw/saveAnswers", {
                    classroomid: object.Classroomid,
                    AssignmentId: object.Assignmentid,
                    currentClause: object.currentClause,
                    Clauses: object.Clauses,
                },
                function(data) {
                    res(data);
                }
            );
        })
    }
}

SaveAttempt = function(object) {
    if ((Attempt[0] == null || !Attempt[0].Finished && user.role == 'Student')) {
        return new Promise(function(res, rej) {
            $.post(
                port2 + "SFL_Draw/saveAttempt", {
                    classroomid: object.Classroomid,
                    AssignmentId: object.Assignmentid,
                    currentClause: object.currentClause,
                    Clauses: object.Clauses,
                    Grade: object.Grade
                },
                function(data) {
                    res(data);
                }
            );
        })
    }
}



// just changes the complete boolean to false in the database associated with this assignment 
EditSolution = function(object) {
    return new Promise(function(res, rej) {
        $.post(
            port2 + "SFL_Draw/EditSolution", {
                AssignmentId: assignment._id,
            },
            function(data) {
                res(data);
            }
        );
    })
}

// just changes the complete boolean to true in the database associated with this assignment 
SetSolution = function(object) {
    return new Promise(function(res, rej) {
        $.post(
            port2 + "SFL_Draw/re-setSolution", {
                AssignmentId: assignment._id,
            },
            function(data) {
                res(data);
            }
        );
    })
}