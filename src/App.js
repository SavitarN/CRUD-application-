
import './App.css';
import React, { useState, useEffect } from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal'
import { PlusCircle, Edit, Trash2 } from 'react-feather';

function App() {
  const blankUser = {
    'name': '',
    'email': '',
    'phone': '',
    'dob': '',
    'address': {
      city: '',
      district: '',
      province: '',
      country: '',

    },
    photo: null,

  }

  //use of state for data//
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(blankUser);
  const [userdata, setUserdata] = useState([]);
  const [action, setAction] = useState('Add');
  const [editIndex, setEditIndex] = useState
    (null);
  const [countries, setCountries] = useState([]);
  const [userErrors, setUserErrors] = useState({});




  //API for country //
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const countryNames = data.map(country => country.name.common);
        setCountries(countryNames);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);



  //VALIDATION PART//
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!user.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    if (!user.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;

    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!user.phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{7,}$/.test(user.phone)) {
      errors.phone = 'Phone number must be at least 7 digits';
      isValid = false;
    }

    setUserErrors(errors);
    return isValid;

  };



  //modal window for input form , add user and edit user//
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false);
    setAction('Add');
    setUserErrors({});

  }


  const addUser = () => {
    if (validateForm()) {


      setUserdata([...userdata, user]);
      setUser(blankUser);
      onCloseModal();
    }
  };


  //editing functionality code//
  const editUser = (index) => {
    setAction('Edit');
    const selectedUser = userdata.find((x, i) => i === index);
    setUser(selectedUser);
    setEditIndex(index);
    onOpenModal();
  }

  const updateUser = () => {
    if (validateForm()) {


      const newUsers = userdata.map((x, i) => {
        if (i === editIndex) {
          x = user;
        }
        return x;
      });
      setUserdata(newUsers);
      setUser(blankUser);
      setEditIndex(null);
      onCloseModal();
    }
  };


  //deleting the user//

  const deleteUser = (index) => {
    const newUsers = userdata.filter((x, i) => {
      return i !== index;
    })
    setUserdata(newUsers);
  };


  //function for photo //
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setUser((prevUser) => ({
      ...prevUser,
      photo: file,
    }));
  };



  //API used for fetching the country details//
  const handleCountryChange = selectedCountry => {

    fetch(`https://restcountries.com/v3.1/name/${selectedCountry}`)
      .then(response => response.json())
      .then(data => {

        const countryData = data[0];
        console.log(countryData);
        setUser(prevUser => ({
          ...prevUser,
          address: {
            ...prevUser.address,
            city: countryData.capital,
            district: countryData.capital,
            continent: countryData.region,
            country: selectedCountry,
          },
        }));
      })
      .catch(error => console.error('Error fetching country details:', error));
  };


  return (

    <div className="container">
      <div className='d-flex'>
        <h1>Crud Operation</h1>
      </div>

      <div className='toolbar'>
        <button className='btn' onClick={onOpenModal}>
          <PlusCircle size={16}></PlusCircle>
          <span>Add</span>
        </button>
      </div>
      <hr />

      {/* <p>{JSON.stringify(userdata)}</p> */}
      <table className='table'>
        <thead>
          <th>Name</th>
          <th>Email</th>
          <th>Phone Number</th>
          <th>DOB</th>
          <th>Address</th>
          <th>Photo</th>
          <th>Action</th>
        </thead>
        <tbody>
          {userdata.length > 0 && userdata.map((user, index) => {
            return (<tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.dob}</td>

              <td>{`${user.address.city}, ${user.address.province}, ${user.address.country}`}</td>

              <td>
                {user.photo && <img src={URL.createObjectURL(user.photo)} alt="User" style={{ width: '50px', height: '50px' }} />}
              </td>

              <td>
                <button class="btn ml2" onClick={() => editUser(index)}>
                  <Edit size={16}></Edit>
                  <span>Edit</span>
                </button>
                <button class="btn ml2" onClick={() => deleteUser(index)}>
                  <Trash2 size={16}></Trash2>
                  <span>Delete</span>
                </button>
              </td>
            </tr>)
          })
          }

        </tbody>
      </table>


      <Modal open={open} onClose={onCloseModal} center>
        <h2>{action} User</h2>

        <p>{JSON.stringify(user)}</p>
        <div className='form'>
          <label htmlFor='name'>Name</label>
          <input type='text' value={user.name} onChange={(e) => setUser({ ...user, "name": e.target.value })} />
          {userErrors.name && <p className="error">{userErrors.name}</p>}

          <label htmlFor='name'>Email</label>
          <input type='text' value={user.email} onChange={(e) => setUser({ ...user, "email": e.target.value })} />
          {userErrors.email && <p className="error">{userErrors.email}</p>}

          <label htmlFor='name'>Phone</label>
          <input type='number' value={user.phone} onChange={(e) => setUser({ ...user, "phone": e.target.value })} />
          {userErrors.phone && <p className="error">{userErrors.phone}</p>}

          <label htmlFor='name'>DOB</label>
          <input type='date' value={user.dob} onChange={(e) => setUser({ ...user, "dob": e.target.value })} />

          <label htmlFor='country'>country</label>
          <select value={user.address.country} onChange={e => handleCountryChange(e.target.value)}>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>

            ))}
          </select>

          <label htmlFor="photo">Photo</label>
          <input type="file" id="photo" onChange={handlePhotoChange} />

          {action === 'Add' && <button className='btn' onClick={() => addUser()}>Submit</button>}

          {action === 'Edit' && <button className='btn' onClick={() => updateUser()}>Update</button>}
        </div>

      </Modal>
    </div>
  );
}

export default App;

