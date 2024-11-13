import { useState ,ChangeEvent } from 'react';
import { Todo } from './types/Todo';

export default function App(){
  //初期値：空文字''
  const[text, setText] = useState('');
  const[todos, setTodos] = useState<Todo[]>([]);

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
    };
    setTodos((todos) => [newTodo, ...todos]);

    setText('');
  };

  // 登録済みTodoの編集用イベントハンドラ
  const handleEdit = (id: number, value: string) => {
    setTodos((todos) =>{
      /*
      引数として渡された todo の idが一致する
      更新前のtodosステート内のtodoのvalueプロパティーを引数value(= e. targt.value)に書き換える
      */
     const newTodos = todos.map((todo) => {
      if(todo.id === id){       //===は数値も型も比較する
          /*
           * この階層でオブジェクト todo をコピー・展開し、
           * その中で value プロパティを引数で上書きする
          */
          return {...todo, value: value };
          
      }
      return todo;
     });
      // todos ステートが書き換えられていないかチェック
      console.log('=== Original todos ===');
      todos.map((todo) => {
        console.log(`id: ${todo.id}, value: ${todo.value}`);
      });
     //ステートの更新
     return newTodos;
    });
  };
  
  //チェックボックスがチェックされたときの処理
  const handleCheck = (id: number, checked: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return {...todo, checked};
        }
        return todo;
      });

      return newTodos;
    });
  };

  return(
    <>
      <form onSubmit={
        (e) => {
          e.preventDefault()
          handleSubmit()
        }}>
        <input
          type="text"
          //text ステートが持っている入力中テキストの値を value として表示
          value={text}
          //onChange イベント（＝入力テキストの変化）を text ステートに反映する
          onChange={handleChange}
        />
        
        <input
          type="submit"
          value="追加"
          onSubmit={handleSubmit}
        />
      </form>
      <ul>
      {todos.map((todo) => {
        return (
          <li key={todo.id}>
            <input
             type="checkbox"
             checked={todo.checked}
             onChange={() => handleCheck(todo.id, !todo.checked)}
            />
            <input
              type="text"
              disabled={todo.checked}
              value={todo.value}
              onChange={(e) => handleEdit(todo.id, e.target.value)}
            />
          </li>
        );
      })}
      </ul>
    </>
  );
};


// git init
// git add -A
// git commit -m "first commit"
// git branch -M main
// git remote add origin (URL)
// git push -u origin main