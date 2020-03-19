import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Modal, Button, Form } from 'react-bootstrap';
import moment from 'moment';

import './App.css';
import { initialData } from './data.js';

class App extends Component {
  constructor() {
    super();

    this.state = {
      ...initialData,
      showModal: false,
      titleValue: "",
      selectValue: "",
      assigneeValue: "",
      startDate: '',
      endDate: '',
      validated: false,
      columnId: null,
    };

    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    const { columns } = this.state;
    if (!result.destination) {
      return;
    }

    if (result.source.droppableId === result.destination.droppableId) {
      const newTaskArray = Array.from(columns[result.source.droppableId].taskIds);
      const [removed] = newTaskArray.splice(result.source.index, 1);
      newTaskArray.splice(result.destination.index, 0, removed);

      const newColumn = {
        ...columns[result.source.droppableId],
        taskIds: newTaskArray,
      };

      this.setState({
        columns: {
          ...columns,
          [result.source.droppableId]: newColumn,
        },
      });

      return;
    }

    const newStartTaskArray = Array.from(columns[result.source.droppableId].taskIds);
    const newDestTaskArray = Array.from(columns[result.destination.droppableId].taskIds);
    const [removed] = newStartTaskArray.splice(result.source.index, 1);
    newDestTaskArray.splice(result.destination.index, 0, removed);

    const newStartColumn = {
      ...columns[result.source.droppableId],
      taskIds: newStartTaskArray,
    }

    const newDestColumn = {
      ...columns[result.destination.droppableId],
      taskIds: newDestTaskArray,
    }

    this.setState({
      columns: {
        ...columns,
        [result.source.droppableId]: newStartColumn,
        [result.destination.droppableId]: newDestColumn,
      },
    });

    return;
  }

  getDroppableStyle = isDraggingOver => ({
    backgroundColor: isDraggingOver ? "#808080" : "#FFFFFF",
  })

  getDraggableStyle = (isDragging, draggableStyle) => ({
    // backgroundColor: isDragging ? "#138535" : "#F7F6F3",
    ...draggableStyle
  })

  getTagStyle = (tag) => {
    const { tagsColor } = this.state;
    return {
      backgroundColor: tagsColor[tag].backgroundColor,
      color: tagsColor[tag].color,
    };
  }

  getDays = (date) => {
    const parsedDate = moment(date, 'YYYY-MM-DD').diff(moment.now(), 'days');
    let parsedDateStyle = null;
    let parsedDataContent = null;
    if (parsedDate >= 0) {
      parsedDateStyle = {
        fontSize: 10,
        color: 'gray',
      }
      if (parsedDate === 0) {
        parsedDataContent = 'Today';
      } else if (parsedDate === 1) {
        parsedDataContent = 'Tomorrow';
      } else if (parsedDate > 1) {
        parsedDataContent = parsedDate.toString() + ' days';
      }
    } else {
      parsedDateStyle = {
        fontSize: 10,
        color: 'red',
      }
      if (parsedDate === -1) {
        parsedDataContent = 'Yesterday';
      } else {
        parsedDataContent = parsedDate.toString() + ' days ago';
      }
    }
    return <span style={parsedDateStyle} className="ml-auto font-weight-bold day my-auto">{parsedDataContent}</span>
  }

  createTask = (title, tags, assignee, start_date, end_date, columnId) => {
    const {tasks, columns} = this.state;

    const newTaskId = 'task-' + (Object.keys(tasks).length + 1).toString();
    const newTask = {
      issue_id: newTaskId,
      title,
      assignee,
      start_date,
      end_date,
      tags,
    }

    const newColumnTasks = Array.from(columns[columnId].taskIds);
    newColumnTasks.splice(newColumnTasks.length, 0, newTaskId);

    const newColumn = {
      ...columns[columnId],
      taskIds: newColumnTasks
    };

    this.setState({
      tasks: {
        ...tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...columns,
        [columnId]: newColumn,
      }
    })
  }

  render() {
    const { columnIds, columns, tasks, showModal, selectValue, assigneeValue, titleValue, startDate, endDate, validated, columnId } = this.state;
    const { getDroppableStyle, getDraggableStyle, createTask, getTagStyle, getDays } = this;

    return (
      <div className="App">
        <body className="App-body">
          <div className="d-flex">
            <img className="App-logo" src="images/prosa-logo.png" alt=""/>
            <h2>Kanban Prosa</h2>
          </div>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <div className="d-flex">
            {
              columnIds.map((column) => (
                  <div
                    className="border px-2 py-1 column mr-2 h-50 rounded" 
                    key={columns[column].id}
                  >
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <h5 className="">{columns[column].title}</h5>
                      <button type="button" className="btn btn-sm btn-info rounded-pill mr-1" onClick={() => this.setState({showModal: true, columnId: column})}>
                        + Add Task
                      </button>
                    </div>
                    <Droppable
                      // key={columns[column].id}
                      droppableId={columns[column].id}
                    >
                      {(provided, snapshot) => (
                        <div
                          // key={columns[column].id}
                          className="px-2 py-1 my-2 rounded droppable"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={getDroppableStyle(snapshot.isDraggingOver)}
                        >
                          {columns[column].taskIds.map((task, index) => (
                            <Draggable
                              key={tasks[task].issue_id}
                              draggableId={tasks[task].issue_id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  // key={tasks[task].id}
                                  className="draggable px-2 py-2 my-2 rounded"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getDraggableStyle(snapshot.isDragging, provided.draggableProps.style)}
                                >
                                  <h6>{tasks[task].title}</h6>
                                  <div className="d-flex">
                                    <div className="bg-secondary rounded-circle assignee d-flex justify-content-center my-auto font-weight-bold text-uppercase">
                                      <span>{tasks[task].assignee[0]}</span>
                                    </div>
                                    <span className="rounded-pill px-1 text-uppercase tags ml-2 mt-1 font-weight-bold" style={getTagStyle(tasks[task].tags)}>{tasks[task].tags}</span>
                                    {/* <span className="ml-auto font-weight-bold day my-auto">{getDays(tasks[task].end_date)}</span> */}
                                    {getDays(tasks[task].end_date)}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )
              )
            }
            </div>
          </DragDropContext>
          <Modal
            show={showModal}
            centered
            onHide={() => this.setState({showModal: false, selectValue: "", validated: false})}
          >
            <Form
              noValidate
              onSubmit={(event) => {
                this.setState({validated: true})

                event.preventDefault();
                event.stopPropagation();

                if (event.currentTarget.checkValidity()) {
                  createTask(titleValue, selectValue, assigneeValue, startDate, endDate, columnId);
                  this.setState({
                    titleValue: '',
                    selectValue: '',
                    assigneeValue: '',
                    startDate: '',
                    endDate: '',
                    validated: false,
                    showModal: false,
                  })
                }
              }}
            >
              <Modal.Body>
                <h4>New Task</h4>
                  <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control autoComplete="off" isInvalid={validated && titleValue === ''} onChange={(event) => this.setState({titleValue: event.target.value})} value={titleValue} type="text" placeholder="Enter Title"/>
                  </Form.Group>
                  <Form.Group controlId="formTags">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control required isInvalid={validated && selectValue === ''} value={selectValue} onChange={(event) => this.setState({selectValue: event.target.value})} as="select">
                      <option value={''} disabled>Select Tags</option>
                      <option value={'Design'}>Design</option>
                      <option value={'Backend'}>Backend</option>
                      <option value={'Research'}>Research</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formAssignee">
                    <Form.Label>Assignee</Form.Label>
                    <Form.Control autoComplete="off" isInvalid={validated && assigneeValue === ''} onChange={(event) => this.setState({assigneeValue: event.target.value})} value={assigneeValue}  required type="text" placeholder="Enter Title"/>
                  </Form.Group>
                  <Form.Group controlId="formStartDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control onChange={(event) => this.setState({startDate: event.target.value})} value={startDate} isInvalid={validated && startDate === null} required type="date" placeholder="Enter Title"/>
                  </Form.Group>
                  <Form.Group controlId="formEndDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control onChange={(event) => this.setState({endDate: event.target.value})} value={endDate} isInvalid={validated && startDate === null}  required type="date" placeholder="Enter Title"/>
                  </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit">Submit</Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </body>
      </div>
    );
  }
}

export default App;
