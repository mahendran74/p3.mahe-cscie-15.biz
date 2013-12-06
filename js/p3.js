var vGanttChart = new JSGantt.GanttChart('vGanttChart',document.getElementById('GanttChartDIV'), 'day');

vGanttChart.setShowRes(1); // Show/Hide Responsible (0/1)
vGanttChart.setShowDur(1); // Show/Hide Duration (0/1)
vGanttChart.setShowComp(1); // Show/Hide % Complete(0/1)
vGanttChart.setCaptionType('Resource');  // Set to Show Caption (None,Caption,Resource,Duration,Complete)

var vTaskID = 1;

$(window).load(function(){
  $('#alertWelcome').hide();
  $('#welcomeWindow').modal('show');
});
var resList = new Array();
var groupList = new Array();
var dependList = new Array();

function toTitleCase(str) {
  return str.replace(/(?:^|\s)\w/g, function(match) {
    return match.toUpperCase();
  });
};
function printDiv(divID) {
	//Get the HTML of div
	var divElements = document.getElementById(divID).innerHTML;
	//Get the HTML of whole page
	var oldPage = document.body.innerHTML;
	//Reset the page's HTML with div's HTML only
	document.body.innerHTML = "<html><head><title></title></head><body>"
		+ divElements + "</body>";
	//Print Page
	window.print();
	//Restore orignal HTML
	document.body.innerHTML = oldPage;
};
function format(item) {
  return item.text;
};
    $(function() {
      $('#ganttHeading').tooltip();
      $('#newTask').on('click', function(e) {
        e.preventDefault();
        $('#alertTask').hide();
        $('#newTaskWindow').modal('show');
      });
	  $('#newTask').bind('show',function(){
        $("#taskName").val('');
     });
      $('#newGroup').on('click', function(e) {
        e.preventDefault();
        $('#alertGroup').hide();
        $('#newGroupWindow').modal('show');
      });
      $('#newMilestone').on('click', function(e) {
        e.preventDefault();
        $('#alertMilestone').hide();
        $('#newMilestoneWindow').modal('show');
      });
	  $('#printThis').on('click', function(e) {
        e.preventDefault();
        printDiv('GanttChartDIV');
      });
	  
      $('#startButton').on('click', function(e) {
        e.preventDefault();
        if ($('#projectName').val()) {
          $('#ganttHeading h1').text(toTitleCase($('#projectName').val()));
          $('#welcomeWindow').modal('hide');
      if( vGanttChart ) {
        vGanttChart.AddTaskItem(new JSGantt.TaskItem(
            vTaskID,                              // Task ID
            toTitleCase($('#projectName').val()), // Task Name
            '',                                   // Task Start Date
            '',                                   // Task End Date
            '#ff0000',                            // Task Color
            '',                                   // Link
            0,                                    // Milestone Indicator
            '',                                   // Task Resource
            0,                                    // Percentage complete
            1,                                    // Group Indicator
            0,                                    // Parent group
            1,                                    // Task Tree Open/Close Indicator
            ''));                                 // Dependent Task
        groupList.push({id:vTaskID, text:toTitleCase($('#projectName').val())});
        vGanttChart.Draw();	
        vGanttChart.DrawDependencies();
      }
      else
      {
        alert("not defined");
      }					
        } else {
            $('#alertWelcome').show().find('strong')
            .text('Please enter your project name');
          $('#projectName').focus();        			
        }
      });
      $('#ganttHeading').on('click', function(e) {
        e.preventDefault();
        $('#newProjectName').value = $('#ganttHeading').text();
        $('#alertChangeProjectName').hide();
        $('#changeProjectNameWindow').modal('show');
      });
      $('#saveButton').on('click', function(e) {
        e.preventDefault();
        if ($('#newProjectName').val()) {
          $('#ganttHeading h1').text(toTitleCase($('#newProjectName').val()));
          $('#changeProjectNameWindow').modal('hide');        			
        } else {
            $('#alertChangeProjectName').show().find('strong')
            .text('Please enter your project name');
          $('#newProjectName').focus();        			
        }
      });
  $('#groupSaveButton').on('click', function(e) {
        e.preventDefault();
    // Validate the values
    if (!$('#groupName').val()) {
            $('#alertGroup').show().find('strong')
            .text('Please enter a group name');
          $('#groupName').focus();
/*          		} else if (!$('#taskResource').val()) {
            $('#alertTask').show().find('strong')
            .text('Please enter or choose a resource for this task.');
          $('#taskResource').focus(); */
        } else if (!$('#groupParent').val()) {
            $('#alertGroup').show().find('strong')
            .text('Please choose a task group for this task.');
          $('#groupParent').focus();
        } else {
          $('#newGroupWindow').modal('hide'); 
          // Add the task
          vTaskID = vTaskID + 1;
          vGanttChart.AddTaskItem(new JSGantt.TaskItem(
            vTaskID,                     // Task ID
            $('#groupName').val(),       // Task Name
            '',                          // Task Start Date
            '',                          // Task End Date
            '',                          // Task Color
            '',                          // Link
            0,                           // Milestone Indicator
            $('#groupResource').val(),   // Task Resource
            '',                          // Percentage complete
            1,                           // Group Indicator
            $('#taskParent').val(),      // Parent group
            $('#groupOpenClose').val(),  // Task Tree Open/Close Indicator
            ''));                        // Dependent Task
          // Redraw the chart
          resList.push($('#groupResource').val());
          groupList.push({id:vTaskID, text:$('#groupName').val()});
          $('#groupResource').typeahead('destroy');
          $('#groupResource').typeahead({
            local : resList
          });
          vGanttChart.Draw();
          vGanttChart.DrawDependencies();
        }
      });
  $('#msSaveButton').on('click', function(e) {
    e.preventDefault();
    // Validate the values
    if (!$('#milestoneName').val()) {
      $('#alertMilestone').show().find('strong').text('Please enter your project name');
      $('#milestoneName').focus();
    } else if (!$('#milestoneDate').val()) {
      $('#alertMilestone').show().find('strong').text('Please enter a date for this milestone.');
      $('#milestoneDate').focus();
    } else if (!$('#milestoneResource').val()) {
      $('#alertMilestone').show().find('strong').text('Please enter or choose a resource for this mileston.');
      $('#milestoneResource').focus(); 
    } else if (!$('#milestoneParent').val()) {
      $('#alertMilestone').show().find('strong').text('Please choose a task group for this milestone.');
      $('#milestoneParent').focus();
    } else {
      $('#newMilestoneWindow').modal('hide'); 
      // Add the Milestone
      vTaskID = vTaskID + 1;
      vGanttChart.AddTaskItem(new JSGantt.TaskItem(
        vTaskID,                       // Milestone ID
        $('#milestoneName').val(),     // Milestone Name
        $('#milestoneDate').val(),     // Milestone Start Date
        $('#milestoneDate').val(),     // Milestone End Date
        '#ff00ff',                     // Milestone Color
        '',                            // Link
        1,                             // Milestone Indicator
        $('#milestoneResource').val(), // Task Resource
        '',                            // Percentage complete
        0,                             // Group Indicator
        $('#milestoneParent').val(),   // Parent group
        0,                             // Task Tree Open/Close Indicator
        ''));                          // Dependent Task
      // Redraw the chart
      resList.push($('#milestoneResource').val());
      $('#milestoneResource').typeahead('destroy');
      $('#milestoneResource').typeahead({
        local : resList
      });
      vGanttChart.Draw();
      vGanttChart.DrawDependencies();
    }
  });
  $('#taskSaveButton').on('click', function(e) {
    e.preventDefault();
    // Validate the values
    if (!$('#taskName').val()) {
      $('#alertTask').show().find('strong').text('Please enter a task name');
      $('#taskName').focus();
    } else if (!$('#taskStartDate').val()) {
      $('#alertTask').show().find('strong').text('Please enter a start date for this task.');
      $('#taskStartDate').focus();
    } else if (!$('#taskEndDate').val()) {
      $('#alertTask').show().find('strong').text('Please enter a end date for this task.');
      $('#taskEndDate').focus();
    } else if (!$('#taskResource').val()) {
      $('#alertTask').show().find('strong').text('Please enter or choose a resource for this task.');
      $('#taskResource').focus();
    } else if (!$('#taskParent').val()) {
      $('#alertTask').show().find('strong').text('Please choose a task group for this task.');
      $('#taskParent').focus();
    } else {
      $('#newTaskWindow').modal('hide'); 
      // Add the task
      vTaskID = vTaskID + 1;
      vGanttChart.AddTaskItem(new JSGantt.TaskItem(
        vTaskID,                   // Task ID
        $('#taskName').val(),      // Task Name
        $('#taskStartDate').val(), // Task Start Date
        $('#taskEndDate').val(),   // Task End Date
        $('#taskColor').val(),     // Task Color
        '',                        // Link
        0,                         // Milestone Indicator
        $('#taskResource').val(),  // Task Resource
        $('#perComplete').val(),   // Percentage complete
        0,                         // Group Indicator
        $('#taskParent').val(),    // Parent group
        1,                         // Task Tree Open/Close Indicator
        $('#taskDepend').val()));  // Dependent Task
        // Redraw the chart
        resList.push($('#taskResource').val());
        dependList.push({id:vTaskID, text:$('#taskName').val()});
        $('#taskResource').typeahead('destroy');
        $('#taskResource').typeahead({
          local : resList
        });
        vGanttChart.Draw();
        vGanttChart.DrawDependencies();
      }
    });
   });

  $(function() {
      $('#taskStartDate').datepicker();
      $('#taskEndDate').datepicker();
      $('#milestoneDate').datepicker();
      $('#taskColor').colorpicker({
        format : 'hex'
      });
      $('#taskResource').typeahead({
        local : resList
      });
      $('#perComplete').slider({
        formater : function(value) {
          return 'Percentage complete : ' + value + ' %';
        }
      });
      $("#perComplete").on('slide', function(slideEvt) {
        $("#ex6SliderVal").text(slideEvt.value + ' %');
      });

      $("#taskParent").select2({
        data : {
          results : groupList
        },
        formatSelection : format,
        formatResult : format
      });
     
      $("#taskDepend").select2({
        data : {
          results : dependList
        },
        formatSelection : format,
        formatResult : format
      });
      
      $("#groupParent").select2({
        data : {
          results : groupList
        },
        formatSelection : format,
        formatResult : format
      });
      
      $("#milestoneParent").select2({
        data : {
          results : groupList
        },
        formatSelection : format,
        formatResult : format
      });    
      var nowTemp = new Date();
      var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(),
          nowTemp.getDate(), 0, 0, 0, 0);
     
      var startDate = $('#taskStartDate').datepicker({
        onRender : function(date) {
          return date.valueOf() < now.valueOf() ? 'disabled' : '';
        }
      }).on('changeDate', function(ev) {
        if (ev.date.valueOf() > endDate.date.valueOf()) {
          var newDate = new Date(ev.date)
          newDate.setDate(newDate.getDate() + 1);
          endDate.setValue(newDate);
        }
        startDate.hide();
        $('#taskEndDate')[0].focus();
      }).data('datepicker');
     
      var endDate = $('#taskEndDate').datepicker({
        onRender : function(date) {
          return date.valueOf() <= startDate.date.valueOf() ? 'disabled' : '';
        }
      }).on('changeDate', function(ev) {
        if (ev.date.valueOf() < startDate.date.valueOf()) {
          $('#alertTask').show().find('strong')
            .text('The end date can not be less then the start date');
          $('#taskEndDate')[0].focus();
        } else {
          $('#alertTask').hide();
          vEndDate = new Date(ev.date);
          endDate.hide();
        }
      }).data('datepicker');
     });