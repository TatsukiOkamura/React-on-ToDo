import { useState ,ChangeEvent } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

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

  //削除ボタンの処理
  const handleRemove = (id: number, removed: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return {...todo, removed};
        }
        return todo;
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
             onChange={() => handleCheck(todo.id, !todo.checked)}
            />
            <input
              type="text"
              disabled={todo.checked || todo.removed}
              value={todo.value}
              onChange={(e) => handleEdit(todo.id, e.target.value)}
            />
            <button onClick={() => handleRemove(todo.id, !todo.removed)}>
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
// git add -A
// git commit -m "first commit"
// git branch -M main
// git remote add origin (URL)
// git push -u origin main