import styles from './Button.module.css'
type ButtonType = {
  children: React.ReactNode,
  onClick: (e) => void,
  type: string
}
function Button({children, onClick, type}:ButtonType) {
  return (
    <button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
      {children}
    </button>
  )
}

export default Button
