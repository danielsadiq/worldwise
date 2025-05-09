import type { CityType } from "../types/cityType";
import styles from './CityItem.module.css'
import { Link, useNavigate } from "react-router-dom";
import { useCities } from "../contexts/useCities";
const formatDate = (date:string|Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({city}:{city:CityType}) {
  const {cityName, emoji, date, id, position} = city
  const {currentCity, deleteCity} = useCities();
  const navigate = useNavigate();
  async function handleDelete(id:number){
    await deleteCity(id);
    navigate("/app/cities");
    
  }
  return (
    <li>
      <Link className={`${styles.cityItem} ${currentCity.id === id ? styles["cityItem--active"]:""}`} to={`${id}?lat=${position.lat}&lng=${position.lng}`}>
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={()=> handleDelete(id||0)}>&times;</button>
      </Link>
    </li>
  )
}

export default CityItem
