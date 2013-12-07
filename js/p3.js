var vGanttChart = new JSGantt.GanttChart('vGanttChart', document
    .getElementById('GanttChartDIV'), 'day');

vGanttChart.setShowRes(1); // Show/Hide Responsible (0/1)
vGanttChart.setShowDur(1); // Show/Hide Duration (0/1)
vGanttChart.setShowComp(1); // Show/Hide % Complete(0/1)
vGanttChart.setCaptionType('Resource'); // Set to Show Caption
                                        // (None,Caption,Resource,Duration,Complete)

var vTaskID = 1;

$(window).load(function() {
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
/**
 * Function prints the contents of a DIV
 * @param divID
 */
function printDiv(divID) {
  // Get the HTML of div
  var divElements = document.getElementById(divID).innerHTML;
  // Get the HTML of whole page
  var oldPage = document.body.innerHTML;
  // Reset the page's HTML with div's HTML only
  document.body.innerHTML = "<html><head><title></title></head><body>"
      + divElements + "</body>";
  // Print Page
  window.print();
  // Restore orignal HTML
  document.body.innerHTML = oldPage;
};

function format(item) {
  return item.text;
};

/**
 * Process the Edit task button click
 * @param vTaskID
 */
function editTaskItem(vTaskID) {
  var tempTaskItem = JSGantt.LookUpTask(vGanttChart, vTaskID);
  $('#alertTask').hide();
  $('#taskName').val(tempTaskItem.getName);
  $('#taskStartDate').val(
      (tempTaskItem.getStart().getMonth() + 1) + '/'
          + tempTaskItem.getStart().getDate() + '/'
          + tempTaskItem.getStart().getFullYear());
  $('#taskEndDate').val(
      (tempTaskItem.getEnd().getMonth() + 1) + '/'
          + tempTaskItem.getEnd().getDate() + '/'
          + tempTaskItem.getEnd().getFullYear());
  $('#taskColor').val(tempTaskItem.getColor);
  $('#perComplete').val(tempTaskItem.getCompVal);
  $('#taskResource').val(tempTaskItem.getResource);
  $('#taskParent').val(tempTaskItem.getParent);
  $('#taskDepend').val(tempTaskItem.getDepend);
  $('#taskID').val(tempTaskItem.getID);
  $('#addTaskAction').hide();
  $('#editTaskAction').show();
  $('#taskModalLabel').text("Edit Task");
  $('#newTaskWindow').modal('show');
}
/**
 * Process the Edit group button click
 * @param vTaskID
 */
function editGroupItem(vTaskID) {
  var tempTaskItem = JSGantt.LookUpTask(vGanttChart, vTaskID);
  if (tempTaskItem) {
    $('#alertGroup').hide();
    $('#groupName').val(tempTaskItem.getName);
    $('#groupResource').val(tempTaskItem.getResource);
    $('#groupParent').val(tempTaskItem.getParent);
    $('#groupOpenClose').val(tempTaskItem.getOpen);
    $('#groupID').val(tempTaskItem.getID);
    $('#addGroupAction').hide();
    $('#editGroupAction').show();
    $('#groupModalLabel').text("Edit Group");
    $('#newGroupWindow').modal('show');
  }
}
/**
 * Process the Edit milestone button click
 * @param vTaskID
 */
function editMilestone(vTaskID) {
  var tempTaskItem = JSGantt.LookUpTask(vGanttChart, vTaskID);
  $('#alertMilestone').hide();
  $('#milestoneName').val(tempTaskItem.getName);
  $('#milestoneDate').val(
      (tempTaskItem.getStart().getMonth() + 1) + '/'
          + tempTaskItem.getStart().getDate() + '/'
          + tempTaskItem.getStart().getFullYear());
  $('#milestoneResource').val(tempTaskItem.getResource);
  $('#milestoneParent').val(tempTaskItem.getParent);
  $('#msID').val(tempTaskItem.getID);
  $('#addMsAction').hide();
  $('#editMsAction').show();
  $('#milestoneModalLabel').text("Edit Milestone");
  $('#newMilestoneWindow').modal('show');
}

$(function() {
  $('#ganttHeading').tooltip();
  $('.taskDisplay').tooltip();
  $('#newTask').on('click', function(e) {
    e.preventDefault();
    // Hide unwanted elements
    $('#alertTask').hide();
    $('#editTaskAction').hide();
    $('#addTaskAction').show();
    // Clear the form data
    $('#taskName').val('');
    $('#taskStartDate').val('');
    $('#taskEndDate').val('');
    // Change the modal heading
    $('#taskModalLabel').text("Add New Task");
    // Show the modal
    $('#newTaskWindow').modal('show');
  });
  $('#newGroup').on('click', function(e) {
    e.preventDefault();
    // Hide unwanted elements
    $('#alertGroup').hide();
    $('#addGroupAction').show();
    $('#editGroupAction').hide();
    // Clear the form data
    $('#groupName').val('');
    // Change the modal heading
    $('#groupModalLabel').text("Add New Task Group");
    // Show the modal
    $('#newGroupWindow').modal('show');
  });
  $('#newMilestone').on('click', function(e) {
    e.preventDefault();
    $('#addMsAction').show();
    // Hide unwanted elements
    $('#editMsAction').hide();
    $('#alertMilestone').hide();
    // Change the modal heading
    $('#milestoneModalLabel').text("Add New Milestone");
    // Show the modal
    $('#newMilestoneWindow').modal('show');
  });
  $('#printThis').on('click', function(e) { // Prints just the chart
    e.preventDefault();
    printDiv('GanttChartDIV');
  });
  $('#aboutThis').on('click', function(e) { // Displays About window
    e.preventDefault();
    // Show the modal
    $('#aboutWindow').modal('show');	
  });
  
  $('#startButton').on(
      'click',
      function(e) {
        e.preventDefault();
        if ($('#projectName').val()) { // Process the welcome window event
          $('#ganttHeading').text(toTitleCase($('#projectName').val()));
          $('#welcomeWindow').modal('hide'); // Close modal
          // Add a default task group
          if (vGanttChart) {
            vGanttChart.AddTaskItem(new JSGantt.TaskItem(vTaskID, // Task ID
            toTitleCase($('#projectName').val()), // Task Name
            '', // Task Start Date
            '', // Task End Date
            '#ff0000', // Task Color
            '', // Link
            0, // Milestone Indicator
            '', // Task Resource
            0, // Percentage complete
            1, // Group Indicator
            0, // Parent group
            1, // Task Tree Open/Close Indicator
            '')); // Dependent Task
            groupList.push({
              id : vTaskID,
              text : toTitleCase($('#projectName').val())
            });
            vGanttChart.Draw();
            vGanttChart.DrawDependencies();
          } else {
            alert("not defined");
          }
        } else {
          $('#alertWelcome').show().find('strong').text(
              'Please enter your project name');
          $('#projectName').focus();
        }
      });
  $('#ganttHeading').on('click', function(e) {
    e.preventDefault();
    $('#newProjectName').val($('#ganttHeading').text());
    $('#alertChangeProjectName').hide();
    $('#changeProjectNameWindow').modal('show');
  });
  $('#saveButton').on( // Process change project name event
      'click',
      function(e) {
        e.preventDefault();
        if ($('#newProjectName').val()) {
          $('#ganttHeading').text(toTitleCase($('#newProjectName').val()));
          $('#changeProjectNameWindow').modal('hide');
        } else {
          $('#alertChangeProjectName').show().find('strong').text(
              'Please enter your project name');
          $('#newProjectName').focus();
        }
      });
  $('#groupSaveButton').on( // Process Add group event
      'click',
      function(e) {
        e.preventDefault();
        // Validate the values
        if (!$('#groupName').val()) {
          $('#alertGroup').show().find('strong').text(
              'Please enter a group name');
          $('#groupName').focus();
        } else if (!$('#groupParent').val()) {
          $('#alertGroup').show().find('strong').text(
              'Please choose a task group for this task.');
          $('#groupParent').focus();
        } else {
          $('#newGroupWindow').modal('hide');
          // Add the task
          vTaskID = vTaskID + 1;
          vGanttChart.AddTaskItem(new JSGantt.TaskItem(vTaskID, // Task ID
          toTitleCase($('#groupName').val()), // Task Name
          '', // Task Start Date
          '', // Task End Date
          '', // Task Color
          '', // Link
          0, // Milestone Indicator
          toTitleCase($('#groupResource').val()), // Task Resource
          '', // Percentage complete
          1, // Group Indicator
          $('#taskParent').val(), // Parent group
          $('#groupOpenClose').val(), // Task Tree Open/Close Indicator
          '')); // Dependent Task
          // Redraw the chart
          resList.push(toTitleCase($('#groupResource').val()));
          groupList.push({
            id : vTaskID,
            text : $('#groupName').val()
          });
          $('#groupResource').typeahead('destroy');
          $('#groupResource').typeahead({
            local : resList
          });
          vGanttChart.Draw();
          vGanttChart.DrawDependencies();
        }
      });
  $('#groupEditButton').on( // Process Edit group event
      'click',
      function(e) {
        e.preventDefault();
        // Validate the values
        if (!$('#groupName').val()) {
          $('#alertGroup').show().find('strong').text(
              'Please enter a group name');
          $('#groupName').focus();
        } else if (!$('#groupParent').val()) {
          $('#alertGroup').show().find('strong').text(
              'Please choose a task group for this task.');
          $('#groupParent').focus();
        } else {
          $('#newGroupWindow').modal('hide');
          // Add the task
          vTaskID = vTaskID + 1;
          vGanttChart.EditTaskItem(new JSGantt.TaskItem($('#groupID').val(), // Task
                                                                              // ID
          toTitleCase($('#groupName').val()), // Task Name
          '', // Task Start Date
          '', // Task End Date
          '', // Task Color
          '', // Link
          0, // Milestone Indicator
          toTitleCase($('#groupResource').val()), // Task Resource
          '', // Percentage complete
          1, // Group Indicator
          $('#taskParent').val(), // Parent group
          $('#groupOpenClose').val(), // Task Tree Open/Close Indicator
          '')); // Dependent Task
          // Redraw the chart
          resList.push(toTitleCase($('#groupResource').val()));
          $('#groupResource').typeahead('destroy');
          $('#groupResource').typeahead({
            local : resList
          });
          vGanttChart.Draw();
          vGanttChart.DrawDependencies();
        }
      });
  $('#groupDelButton').on('click', function(e) { // Process Delete group event
    e.preventDefault();
    // Validate the values
    if (confirm('Do you want to delete this group ?')) {
      // Add the task
      vGanttChart.DeleteTaskItem(new JSGantt.TaskItem($('#groupID').val(), // Task ID
      toTitleCase($('#groupName').val()), // Task Name
      '', // Task Start Date
      '', // Task End Date
      '', // Task Color
      '', // Link
      0, // Milestone Indicator
      toTitleCase($('#groupResource').val()), // Task Resource
      '', // Percentage complete
      1, // Group Indicator
      $('#taskParent').val(), // Parent group
      $('#groupOpenClose').val(), // Task Tree Open/Close Indicator
      '')); // Dependent Task
      // Redraw the chart
      resList.push(toTitleCase($('#groupResource').val()));
      groupList.push({
        id : vTaskID,
        text : $('#groupName').val()
      });
      $('#groupResource').typeahead('destroy');
      $('#groupResource').typeahead({
        local : resList
      });
      vGanttChart.Draw();
      vGanttChart.DrawDependencies();
    }
  });
  $('#msSaveButton').on(
      'click',
      function(e) { // Process Edit milestone event
        e.preventDefault();
        // Validate the values
        if (!$('#milestoneName').val()) {
          $('#alertMilestone').show().find('strong').text(
              'Please enter your project name');
          $('#milestoneName').focus();
        } else if (!$('#milestoneDate').val()) {
          $('#alertMilestone').show().find('strong').text(
              'Please enter a date for this milestone.');
          $('#milestoneDate').focus();
        } else if (!$('#milestoneResource').val()) {
          $('#alertMilestone').show().find('strong').text(
              'Please enter or choose a resource for this mileston.');
          $('#milestoneResource').focus();
        } else if (!$('#milestoneParent').val()) {
          $('#alertMilestone').show().find('strong').text(
              'Please choose a task group for this milestone.');
          $('#milestoneParent').focus();
        } else {
          $('#newMilestoneWindow').modal('hide');
          // Add the Milestone
          vTaskID = vTaskID + 1;
          vGanttChart.AddTaskItem(new JSGantt.TaskItem(vTaskID, // Milestone ID
          toTitleCase($('#milestoneName').val()), // Milestone Name
          $('#milestoneDate').val(), // Milestone Start Date
          $('#milestoneDate').val(), // Milestone End Date
          '#ff00ff', // Milestone Color
          '', // Link
          1, // Milestone Indicator
          toTitleCase($('#milestoneResource').val()), // Task Resource
          '', // Percentage complete
          0, // Group Indicator
          $('#milestoneParent').val(), // Parent group
          0, // Task Tree Open/Close Indicator
          '')); // Dependent Task
          // Redraw the chart
          resList.push(toTitleCase($('#milestoneResource').val()));
          $('#milestoneResource').typeahead('destroy');
          $('#milestoneResource').typeahead({
            local : resList
          });
          vGanttChart.Draw();
          vGanttChart.DrawDependencies();
        }
      });
  $('#msEditButton').on(
      'click',
      function(e) { // Process Add milestone event
        e.preventDefault();
        // Validate the values
        if (!$('#milestoneName').val()) {
          $('#alertMilestone').show().find('strong').text(
              'Please enter your project name');
          $('#milestoneName').focus();
        } else if (!$('#milestoneDate').val()) {
          $('#alertMilestone').show().find('strong').text(
              'Please enter a date for this milestone.');
          $('#milestoneDate').focus();
        } else if (!$('#milestoneResource').val()) {
          $('#alertMilestone').show().find('strong').text(
              'Please enter or choose a resource for this mileston.');
          $('#milestoneResource').focus();
        } else if (!$('#milestoneParent').val()) {
          $('#alertMilestone').show().find('strong').text(
              'Please choose a task group for this milestone.');
          $('#milestoneParent').focus();
        } else {
          $('#newMilestoneWindow').modal('hide');
          // Add the Milestone
          vGanttChart.EditTaskItem(new JSGantt.TaskItem($('#msID').val(), // Milestone ID
          toTitleCase($('#milestoneName').val()), // Milestone Name
          $('#milestoneDate').val(), // Milestone Start Date
          $('#milestoneDate').val(), // Milestone End Date
          '#ff00ff', // Milestone Color
          '', // Link
          1, // Milestone Indicator
          toTitleCase($('#milestoneResource').val()), // Task Resource
          '', // Percentage complete
          0, // Group Indicator
          $('#milestoneParent').val(), // Parent group
          0, // Task Tree Open/Close Indicator
          '')); // Dependent Task
          // Redraw the chart
          resList.push(toTitleCase($('#milestoneResource').val()));
          $('#milestoneResource').typeahead('destroy');
          $('#milestoneResource').typeahead({
            local : resList
          });
          vGanttChart.Draw();
          vGanttChart.DrawDependencies();
        }
      });
  $('#msDelButton').on('click', function(e) { // Process Delete task event
    e.preventDefault();
    if (confirm('Do you want to delete this milestone ?')) {
      $('#newMilestoneWindow').modal('hide');
      // Add the Milestone
      vGanttChart.DeleteTaskItem(new JSGantt.TaskItem($('#msID').val(), // Milestone ID
      toTitleCase($('#milestoneName').val()), // Milestone Name
      $('#milestoneDate').val(), // Milestone Start Date
      $('#milestoneDate').val(), // Milestone End Date
      '#ff00ff', // Milestone Color
      '', // Link
      1, // Milestone Indicator
      toTitleCase($('#milestoneResource').val()), // Task Resource
      '', // Percentage complete
      0, // Group Indicator
      $('#milestoneParent').val(), // Parent group
      0, // Task Tree Open/Close Indicator
      '')); // Dependent Task
      // Redraw the chart
      resList.push(toTitleCase($('#milestoneResource').val()));
      $('#milestoneResource').typeahead('destroy');
      $('#milestoneResource').typeahead({
        local : resList
      });
      vGanttChart.Draw();
      vGanttChart.DrawDependencies();
    }
  });
  $('#taskDelButton').on('click', function(e) { // Process Delete task event
    e.preventDefault();
    if (confirm('Do you want to delete this task ?')) {
      $('#newTaskWindow').modal('hide');
      // Add the task
      vGanttChart.DeleteTaskItem(new JSGantt.TaskItem($('#taskID').val(), // Task ID
      toTitleCase($('#taskName').val()), // Task Name
      $('#taskStartDate').val(), // Task Start Date
      $('#taskEndDate').val(), // Task End Date
      $('#taskColor').val(), // Task Color
      '', // Link
      0, // Milestone Indicator
      toTitleCase($('#taskResource').val()), // Task Resource
      $('#perComplete').val(), // Percentage complete
      0, // Group Indicator
      $('#taskParent').val(), // Parent group
      1, // Task Tree Open/Close Indicator
      $('#taskDepend').val())); // Dependent Task
      // Redraw the chart
      // Remove from depend task list
      dependList.splice({
        id : $('#taskID').val(),
        text : $('#taskName').val()
      });
      $('#taskResource').typeahead('destroy');
      $('#taskResource').typeahead({
        local : resList
      });
      vGanttChart.Draw();
      vGanttChart.DrawDependencies();
    }
  });
  $('#taskEditButton').on( // Process Edit task event
      'click',
      function(e) {
        e.preventDefault();
        // Validate the values
        if (!$('#taskName').val()) {
          $('#alertTask').show().find('strong')
              .text('Please enter a task name');
          $('#taskName').focus();
        } else if (!$('#taskStartDate').val()) {
          $('#alertTask').show().find('strong').text(
              'Please enter a start date for this task.');
          $('#taskStartDate').focus();
        } else if (!$('#taskEndDate').val()) {
          $('#alertTask').show().find('strong').text(
              'Please enter a end date for this task.');
          $('#taskEndDate').focus();
        } else if (!$('#taskResource').val()) {
          $('#alertTask').show().find('strong').text(
              'Please enter or choose a resource for this task.');
          $('#taskResource').focus();
        } else if (!$('#taskParent').val()) {
          $('#alertTask').show().find('strong').text(
              'Please choose a task group for this task.');
          $('#taskParent').focus();
        } else {
          $('#newTaskWindow').modal('hide');
          // Add the task
          vTaskID = vTaskID + 1;
          vGanttChart.EditTaskItem(new JSGantt.TaskItem($('#taskID').val(), // Task
                                                                            // ID
          toTitleCase($('#taskName').val()), // Task Name
          $('#taskStartDate').val(), // Task Start Date
          $('#taskEndDate').val(), // Task End Date
          $('#taskColor').val(), // Task Color
          '', // Link
          0, // Milestone Indicator
          toTitleCase($('#taskResource').val()), // Task Resource
          $('#perComplete').val(), // Percentage complete
          0, // Group Indicator
          $('#taskParent').val(), // Parent group
          1, // Task Tree Open/Close Indicator
          $('#taskDepend').val())); // Dependent Task
          // Redraw the chart
          resList.push(toTitleCase($('#taskResource').val()));
          dependList.push({
            id : vTaskID,
            text : $('#taskName').val()
          });
          $('#taskResource').typeahead('destroy');
          $('#taskResource').typeahead({
            local : resList
          });
          vGanttChart.Draw();
          vGanttChart.DrawDependencies();
        }
      });
  $('#taskSaveButton').on(
      'click',
      function(e) {
        e.preventDefault();
        // Validate the values
        if (!$('#taskName').val()) {
          $('#alertTask').show().find('strong')
              .text('Please enter a task name');
          $('#taskName').focus();
        } else if (!$('#taskStartDate').val()) {
          $('#alertTask').show().find('strong').text(
              'Please enter a start date for this task.');
          $('#taskStartDate').focus();
        } else if (!$('#taskEndDate').val()) {
          $('#alertTask').show().find('strong').text(
              'Please enter a end date for this task.');
          $('#taskEndDate').focus();
        } else if (!$('#taskResource').val()) {
          $('#alertTask').show().find('strong').text(
              'Please enter or choose a resource for this task.');
          $('#taskResource').focus();
        } else if (!$('#taskParent').val()) {
          $('#alertTask').show().find('strong').text(
              'Please choose a task group for this task.');
          $('#taskParent').focus();
        } else {
          $('#newTaskWindow').modal('hide');
          // Add the task
          vTaskID = vTaskID + 1;
          vGanttChart.AddTaskItem(new JSGantt.TaskItem(vTaskID, // Task ID
          toTitleCase($('#taskName').val()), // Task Name
          $('#taskStartDate').val(), // Task Start Date
          $('#taskEndDate').val(), // Task End Date
          $('#taskColor').val(), // Task Color
          '', // Link
          0, // Milestone Indicator
          toTitleCase($('#taskResource').val()), // Task Resource
          $('#perComplete').val(), // Percentage complete
          0, // Group Indicator
          $('#taskParent').val(), // Parent group
          1, // Task Tree Open/Close Indicator
          $('#taskDepend').val())); // Dependent Task
          // Redraw the chart
          resList.push(toTitleCase($('#taskResource').val()));
          dependList.push({
            id : vTaskID,
            text : $('#taskName').val()
          });
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
  var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp
      .getDate(), 0, 0, 0, 0);

  var msDate = $('#milestoneDate').datepicker().on('changeDate', function(ev) {
    msDate.hide();
  }).data('datepicker');

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
  }).on(
      'changeDate',
      function(ev) {
        if (ev.date.valueOf() < startDate.date.valueOf()) {
          $('#alertTask').show().find('strong').text(
              'The end date can not be less then the start date');
          $('#taskEndDate')[0].focus();
        } else {
          $('#alertTask').hide();
          vEndDate = new Date(ev.date);
          endDate.hide();
        }
      }).data('datepicker');
});