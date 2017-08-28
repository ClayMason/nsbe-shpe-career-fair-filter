
var jobs;

var includes = function (arr, val) {
    val = val.toUpperCase();
    for (a in arr) arr[a] = arr[a].toUpperCase();
    if (arr.indexOf(val) == -1) return false;
    return true;
};

var isWithin = function (arr, val) {
    val = val.toUpperCase();
    for (a in arr) {
        var temp = arr[a].toUpperCase();

        if (temp.includes(val)) return true;
    }
    return false;
}

// load jobs

$.getJSON('/javascripts/careers.json', function (response) {
    jobs = response;
});

var app = angular.module("filterApp", [], function($interpolateProvider){
    $interpolateProvider.startSymbol('[{');
    $interpolateProvider.endSymbol('}]');
});

app.controller("filterCtrl", function($scope){
    $scope.jobs = jobs['careers'];
    $scope.results = $scope.jobs.length;

    $scope.filterConditions = {
        'major': [],
        'grade_level': {
            'freshman': true,
            'sophomore': true,
            'junior': true,
            'senior': true,
            'graduate': true,
            'phd': true
        },
        'days': {
            'friday': true,
            'saturday': true
        },
    };

    $scope.trigger = function () {

        // action => add, remove
        // category => major, grade_level, days
        // name => name to add or remove into category
        // console.log($scope.filterConditions);
    }

    $scope.majors = [];
    $scope.majorCtrl = function () {
        $scope.majors = $scope.majorField.split(",");

        for (i =0; i < $scope.majors.length; i++) {
            $scope.majors[i] = $scope.majors[i].trim();
        }

        $scope.filterConditions.major = $scope.majors;
        // console.log($scope.filterConditions);
    }

    $scope.checkDays = function (job_days) {
        // returns true or false if days match from filter and $scope.jobs

        // job_days
        // $scope.filterConditions.days

        if ( includes(job_days, "F") == $scope.filterConditions.days.friday &&
             includes(job_days, "S") == $scope.filterConditions.days.saturday)
             return true;
        return false;

    };

    $scope.checkGrades = function (grades) {
        
        if ( includes(grades, "Freshman") == $scope.filterConditions.grade_level.freshman &&
            includes(grades, "Sophomore") == $scope.filterConditions.grade_level.sophomore &&
            includes(grades, "Junior") == $scope.filterConditions.grade_level.junior &&
            includes(grades, "Senior") == $scope.filterConditions.grade_level.senior &&
            includes(grades, "Graduate") == $scope.filterConditions.grade_level.graduate &&
            includes(grades, "PhD") == $scope.filterConditions.grade_level.phd)
            return true;
        return false;
    };

});

app.filter('jobsFilter', function(){
    return function(j, scope){
        filtered_results = [];

        // filter
        if(scope.filterConditions.major.length == 0 || scope.filterConditions.major[0] == "") {
            filtered_results = Object.create(j);
        } else {
            for (i in j){ // each career
                // filter by major

                // last value in filterConditions.major is filtered incompletely
                if ( isWithin(j[i].majors, scope.filterConditions.major[ scope.filterConditions.major.length - 1 ]) ){
                    filtered_results.push(j[i]);
                }
            }
            for(var x = 0; x < scope.filterConditions.major.length-1; x++){
                for( var y=0; y < filtered_results.length; y++){
                    if ( !includes(filtered_results[y].majors, scope.filterConditions.major[x]) ) filtered_results.splice(x, 1);
                }
            }
        }

        // console.log(filtered_results);
        // for (var i = filtered_results.length -1; i >= 0; i--)
         for (var i = filtered_results.length -1; i >= 0; i--)
         {

            // filter by days
            if (!scope.checkDays(filtered_results[i].days_attending) ) // if they dont match, remove
            {
                filtered_results.splice(i, 1);
            }

        }

        // filter by grade
        for (var i = filtered_results.length -1; i>=0; i--){
            
            if (!scope.checkGrades(filtered_results[i].grades)){
                filtered_results.splice(i, 1);
            }

        }

        scope.results = filtered_results.length;
        return filtered_results;

    }
});