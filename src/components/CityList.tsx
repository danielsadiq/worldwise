import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

export type CityType = {
  cityName: string;
  country: string;
  emoji: string;
  date: string;
  notes: string;
  position: {
    lat: number;
    lng: number;
  };
  id: number;
};
type CityListType = {
  cities: CityType[];
  isLoading: boolean;
};
function CityList({ cities, isLoading }: CityListType) {
  if (isLoading) return <Spinner />;
  if (!cities.length) return <Message message="Add your first coty by clicking on a city on the map"/>
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
