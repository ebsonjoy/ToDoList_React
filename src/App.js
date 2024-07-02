
import React from 'react';
import { useState,useEffect } from 'react';
import './App.css';

function App() {
  const [toDos, setToDos] = useState(() => {
    const storedItems = localStorage.getItem('toDos');
    return storedItems ? JSON.parse(storedItems):[];
  });
  const [toDo,setToDo] = useState('')
  const [editText,setEditText] = useState({id:null,text:''})
  useEffect(() => {
    localStorage.setItem('toDos', JSON.stringify(toDos));
  }, [toDos]);

  const getDays = () => {
    const days = ['Sunday','Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    return days[today.getDay()]
  };

  const handleEdit = (id,text) =>{
    setEditText({id,text});
  }
  const handleUpdate = (id,newText) =>{
    setToDos(toDos.map((todo)=>
    todo.id ===id ?{...todo,text:newText}:todo))
    setEditText({id:null,text:''})
  };
  const [error, setError] = useState('');
  const isDuplicate = (text) => {
    return toDos.some((todo) => todo.text.toLowerCase() === text.toLowerCase());
  };
  const addItem = () => {
    if (toDo.trim() === '') {
      setError('Item cannot be empty.');
    } else if (isDuplicate(toDo)) {
      setError('Duplicate item. Please add a different item.');
    } else {
      setToDos([...toDos, { id: Date.now(), text: toDo, status: false }]);
      setToDo('');
      setError('');
    }
  };
  const clearCompleted = () => {
    setToDos(toDos.filter((obj) => !obj.status));
  };


  return (
    <div className="app">
      <div className="mainHeading">
        <h1>ToDo List</h1>
      </div>
      <div className="subHeading">
        <br />
        <h2>Whoop, it's {getDays()} 🌝 ☕ </h2>
      </div>
      <div className="input">
        <input value={toDo} onChange={(e)=>setToDo(e.target.value)} type="text" placeholder="🖊️ Add item..." />
        <i onClick={addItem}  className="fas fa-plus"></i>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="todos">
        {toDos.filter((obj) => !obj.status).map((obj) => (
          <div className="todo" key={obj.id}>
            <div className="left">
              <input
                onChange={(e) => {
                  setToDos(
                    toDos.map((obj2) =>
                      obj2.id === obj.id
                        ? { ...obj2, status: e.target.checked }
                        : obj2
                    )
                  );
                }}
                checked={obj.status}
                type="checkbox"
                name=""
                id=""
              />
              {editText.id === obj.id ? (
                <input
                  type="text"
                  value={editText.text}
                  onChange={(e) =>
                    setEditText({ id: editText.id, text: e.target.value })
                  }
                  onBlur={() => handleUpdate(obj.id, editText.text)}
                  autoFocus
                />
              ) : (
                <p>{obj.text}</p>
              )}
            </div>
            <div className="right">
              <i
                onClick={() => {
                  setToDos(toDos.filter((obj2) => obj2.id !== obj.id));
                }}
                className="fas fa-times"
              ></i>
              <i
                onClick={() => handleEdit(obj.id, obj.text)}
                className="fas fa-edit"
              ></i>
            </div>
          </div>
        ))}
      </div>

      <div className="completedTasks">
        <h2>Completed Tasks</h2>
        {toDos.filter((obj) => obj.status).map((obj) => (
          <div className="todo completed" key={obj.id}>
            <p>{obj.text}</p>
          </div>
        ))}
         {toDos.some((obj) => obj.status) && (
          <button className="clearButton" onClick={clearCompleted}>Clear Completed</button>
        )}
      </div>
    </div>
  );
}


export default App;
