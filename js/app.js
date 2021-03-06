/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
    var attendance = JSON.parse(localStorage.attendance);

    // Count a student's missed days
    function countMissing() {
        $allMissed.each(function() {
            var studentRow = $(this).parent('tr'),
                dayChecks = $(studentRow).children('td').children('input'),
                numMissed = 0;

            dayChecks.each(function() {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
        });
    }
    function Student(info){
        this.name = info.name;
        this.attendanceDays = info.attendanceDays;
    }
    Student.prototype.calculateMissedDays = function(){
        return (12 - this.attendanceDays.length);
    }

    var model = {
        students: 
            [new Student({
                name: "Slappy the Frog",
                attendanceDays: [5, 8, 9, 10, 11, 12]
            }),
            new Student({
                name: "Lilly the Lizard",
                attendanceDays: [2, 3, 4, 5, 7, 8, 9, 11, 12]
            }),
            new Student({
                name: "Paulrus the Walrus",
                attendanceDays: [5, 7, 8]
            }),
            new Student({
                name: "Gregory the Goat",
                attendanceDays: [2, 3, 5, 7, 8, 12]
            }),
            new Student({
                name: "Adam the Anaconda",
                attendanceDays: [5, 6, 7, 12]
            })],
    }

    var controller = {
        init: function(){
          view.init();  
        },
        getStudents: function(){
            return model.students;
        },
    }

    var view = {
        init: function(){
            this.render();
        },
        render: function(){
            $('.name-col-number').remove();
            var students = controller.getStudents(),
                $studentTarget = $('tbody').first();

            for (var i = 12; i > 0; i--){
                var tableHeader = $('<th>' + i + '</th>');
                $('th.name-col').after(tableHeader);   
            }
            
            $.each(students, function(index, value){
                var studentArray = [],
                    $tr = $('<tr class="student"></tr>'),
                    $firstTd = $('<td class="name-col">' + value.name + '</td>'),
                    $lastTd = $('<td class="missed-col">' + value.calculateMissedDays() + '</td>');
                    studentArray.push($firstTd);
                    for(var i = 0; i < 12; i++){
                        var $middleTd;
                        if (value.attendanceDays.indexOf(i) !== -1){
                            $middleTd = $('<td class="attend-col"><input type="checkbox" checked></td>');
                        }
                        else
                            $middleTd = $('<td class="attend-col"><input type="checkbox"></td>');
                        studentArray.push($middleTd);
                    }
                studentArray.push($lastTd);
                $tr.append(studentArray);
                $studentTarget.append($tr);
            });
        }
    }

    controller.init();

    // When a checkbox is clicked, update localStorage
    var $allMissed = $('tbody .missed-col'),
        $allCheckboxes = $('tbody input');

    $allCheckboxes.on('click', function() {
        var studentRows = $('tbody .student'),
            newAttendance = {};

        studentRows.each(function() {
            var name = $(this).children('.name-col').text(),
                $allCheckboxes = $(this).children('td').children('input');

            newAttendance[name] = [];

            $allCheckboxes.each(function() {
                newAttendance[name].push($(this).prop('checked'));
            });
        });

        countMissing();
        localStorage.attendance = JSON.stringify(newAttendance);
    });

    countMissing();
}());
