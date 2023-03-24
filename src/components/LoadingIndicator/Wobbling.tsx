import style from './index.module.css';

export default function Wobbling() {
  return (
    <div className='flex justify-center items-center'>
      <div className={style.wobbling} />
    </div>
  );
}
