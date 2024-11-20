import { useEffect, useState , ChangeEvent } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { isTodos } from './lib/isTodos';
// localforage をインポート
import localforage from 'localforage';


export default function App(){
  //初期値：空文字''
  const[text, setText] = useState('');
  const[todos, setTodos] = useState<Todo[]>([]);
  const[filter, setFilter] = useState<Filter>('all');
  
  // Todo入力欄のchangeイベントハンドラ
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  };

  // Todo登録のイベントハンドラ
  const handleSubmit = () => {
    if (!text) return;
    const newTodo: Todo ={
      value:text,
      id: new Date().getTime(),
      // 初期値（todo 作成時）は false
      checked:false,
      removed:false,
    };
    setTodos((todos) => [newTodo, ...todos]);

    setText('');
  };

  //ジェネリクスを使った簡略化
  const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
    id: number,
    key: K,
    value: V
  ) =>{
    setTodos((todos) =>{
      const newTodos = todos.map((todo) =>{
        if(todo.id === id){
          return{...todo, [key]: value};
        }else{
          return todo;
        }
      });

      return newTodos;
    });
  };

  //絞り込み処理
  const handleFilter = (filter: Filter) =>{
    setFilter(filter);
  };
  
  //ゴミ箱を空にする
  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  };

  //filterメソッドをswitchで使う
  const filteredTodos = todos.filter((todo) => {
    // filter ステートの値に応じて異なる内容の配列を返す
    switch(filter){
      case'all':
        // 削除されていないもの
        return !todo.removed;
      case 'checked':
      // 完了済 **かつ** 削除されていないもの
        return todo.checked && !todo.removed;
      case 'unchecked':
      // 未完了 **かつ** 削除されていないもの
        return !todo.checked && !todo.removed;
      case 'removed':
        // 削除済みのもの
        return todo.removed;
      default:
        return todo;
    }
  });

  //キー名 'todo-20200101' のデータを取得
  // 第 2 引数の配列が空なのでコンポーネントのマウント時のみに実行される
  useEffect(() => {
    localforage
      .getItem('todo-20241120')
      .then((values) => isTodos(values) && setTodos(values as Todo[]));
  }, []);

  //todos ステートが更新されたら、その値を保存
  useEffect(() => {
    localforage.setItem('todo-20241120',todos);
  }, [todos]);
  
  return(
    <>
      <select
       defaultValue="all"
       onChange={(e) => handleFilter(e.target.value as Filter)}
       >
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ゴミ箱</option>
      </select>

      {/*フィルターが`removed` のときは「ごみ箱を空にする」ボタンを表示*/}
      {filter === 'removed' ? (
        
        // クリックイベントに handleEmpty() を渡す
        <button 
          onClick={handleEmpty}
          disabled={todos.filter((todo) => todo.removed).length === 0}
          >
          ゴミ箱を空にする
        </button>
      ):(
        // フィルターが `checked` でなければ Todo 入力フォームを表示
        filter !== 'checked' && (
          <form onSubmit ={(e) => {
              e.preventDefault()
              handleSubmit()
            }}>
            <input
              type="text"
              //text ステートが持っている入力中テキストの値を value として表示
              value={text}
              //onChange イベント（＝入力テキストの変化）を text ステートに反映する
              onChange={(e) => handleChange(e)}
            />
            <input
              type="submit"
              value="追加"
              onSubmit={handleSubmit}
            />
          </form>
        )
      )}
      
      
      <ul>
      
      {filteredTodos.map((todo) => {
        return (
          <li key={todo.id}>
            <input
             type="checkbox"
             disabled={todo.removed}
             checked={todo.checked}
             onChange={() => handleTodo(todo.id, 'checked', !todo.checked)}
            />
            <input
              type="text"
              disabled={todo.checked || todo.removed}
              value={todo.value}
              onChange={(e) => handleTodo(todo.id,'value', e.target.value)}
            />
            <button onClick={() => handleTodo(todo.id,'removed', !todo.removed)}>
              {todo.removed ?'復元' : '削除'}
            </button>
            
          </li>
        );
      })}
      </ul>
    </>
  );
};


// git init
// git add .
// git commit -m "first commit"
// git branch -M main
// git remote add origin (URL)
// git push -u origin main
// git branch test
// git checkout test