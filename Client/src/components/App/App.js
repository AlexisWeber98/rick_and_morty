import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import './App.css';
import Cards from '../Cards/Cards';
import Nav from '../Nav/Nav';
import About from '../About/About';
import Detail from '../Detail/Detail';
import Error404 from '../Error/Error404';
import Form from '../Form/Form';
import Favorites from '../Favorites/Favorites';
import { useEffect, useState} from 'react';
import axios from 'axios';
import SignUp from '../SiginUp/SignUp';



function  App() {
   
   const [characters,setCharacters] = useState([]);

   const [ access, setAccess ] = useState(false);


   


   const location = useLocation();
   
   const navigate = useNavigate();

   const URL = 'http://localhost:3001/rickandmorty';

  


   //-------------------FUNCTIONS--------------------------------------------//



 const  login = async(userData) => {
      const { email, password } = userData;
      
     try {
      const {data} = await axios(`${URL}/login/?email=${email}&password=${password}`)
         const { access } = data;
         setAccess(access);
         access && navigate('/home');
         localStorage.setItem("access", access)
      } catch (error) {
         return error.message
      }
   };


   const signup = async (userInfo) => {
      const { name, email, password } = userInfo;

      try {
        await axios.post(`${URL}/login`,{
         name,
         email,
         password
        });


      } catch (error) {
         return error.message;
      }
   };

   const userAccess = localStorage.getItem("access")
   useEffect(() => {
      if(!userAccess){
      !access && navigate("/")};
   }, [access]);


   const onClose = (id) =>{
      setCharacters(characters.filter((char) => char.id!== id))
   };


   const onSearch = async (id) => {
      try {
        const {data}= await axios(`${URL}/character/${id}`)
         if (data.name){
            setCharacters((oldChars) => [...oldChars, data]);
         }
      } catch  (error) {
         alert('¡No hay personajes con este ID!' )
         
   }
   };
   
   const handleInvalidRoute = () => {
      navigate("/404")
   }


   return (
      <div className='App'>

         {location.pathname !== '/'  && location.pathname !== "/signup" &&<Nav className='Nav' onSearch={onSearch} />}

         <Routes>
            <Route path="/signup" element={<SignUp signup={signup}/>}/>
            <Route path='/' element={<Form login={login}/>}/>
            <Route path='/home' element={ <Cards characters={characters} onClose={onClose}/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path={`/detail/:id`} element= {<Detail/>}/>
            <Route path='/favorites' element={<Favorites/>}/>
            <Route path="/404" element={<Error404 />} />
            <Route path='*' element={handleInvalidRoute} /> 
         </Routes>

        
         
      </div>
   );
}

export default App;
