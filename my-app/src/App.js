import styles from "./app.module.css";
import { Fields } from "./components/todo-fields.jsx";
import { NewTask } from "./components/new-task.jsx";
import { useEffect, useState } from "react";
import { useDebounce } from "./hooks/useDebounce";
import { ref, onValue, push, update, remove } from "firebase/database";
import { db } from "./firebase";

export const App = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [originalTasks, setOriginalTasks] = useState([]);
  const debounceValue = useDebounce(search, 2000);

  // эта часть работает
  useEffect(() => {
    const todosDbRef = ref(db, `todos`);
    return onValue(todosDbRef, (snapshot) => {
      const loadedTasks = snapshot.val() || {};
      setTasks(loadedTasks);
      setOriginalTasks(loadedTasks);
      setIsLoading(false);
    });
  }, [debounceValue]);
  //

  const requestDeleteTask = (id) => {
    setIsDeleting(true);

     const todosDbRef = ref(db, "todos");
     remove(todosDbRef(db, `todos/${id}`))
     .then((response) => {
        console.log("Задача удалена", response);
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const addNewTask = () => {
    const todosDbRef = ref(db, "todos");

    push(todosDbRef, {
      author: "Укажите ваше имя",
      title: "Новая заметка",
    }).then((response) => {
      console.log("Новая задача создана", response);
      
      setTasks([...tasks, response]);
    });
  };

  const editTodos = async (id, payload) => {
    const taskIndex = Object.values(tasks).findIndex((task) => task.id === id);
    const todosDbRef = ref(db, `todos/${id}`)

    update(todosDbRef, {
      ...tasks[taskIndex],
      ...payload,
    });

  };

  const handleChange = (event) => {
    setSearch(event.target.value);
    console.log(search);
  };

  const handleSort = () => {
    if (sort === "") {
      const sortedTasks = [...tasks].sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
      setTasks(sortedTasks);
      setSort("asc");
    } else {
      setTasks(originalTasks);
      setSort("");
    }
  };

  return (
    <div className={styles.app}>
      {isLoading ? (
        <h1 className={styles.todosLoader}>Loading...</h1>
      ) : (
        <div className={styles.app}>
          <Fields
            tasks={tasks}
            requestDeleteTask={requestDeleteTask}
            isDeleting={isDeleting}
            editTodos={editTodos}
            handleChange={handleChange}
            search={search}
            handleSort={handleSort}
          />
          <NewTask addNewTask={addNewTask} />
        </div>
      )}
    </div>
  );
};

export default App;
