import React from 'react';
import style from './RegistrationForm.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL_API_REG } from '../../urls';

const RegistrationForm = () => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phone, setPhone] = React.useState(0);
  const [email, setEmail] = React.useState('');
  const [emailDirty, setEmailDirty] = React.useState(false);
  const [emailError, setEmailError] = React.useState(
    'Email не может быть пустым'
  );
  const [password, setPassword] = React.useState('');
  const [passwordDirty, setPasswordDirty] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(
    'Пароль не может быть пустым'
  );
  const [formValid, setFormValid] = React.useState(false);
  const [status, setStatus] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (emailError || passwordError) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [emailError, passwordError]);

  React.useEffect(() => {
    if (status) {
      const timeoutId = setTimeout(() => {
        navigate('/Main', { replace: true });
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [status]);

  const createUser = async () => {
    try {
      const body = {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        email: email,
        password: password,
      };
      const response = await axios
        .post(URL_API_REG, body)
        .then((data) => {
          console.log(data);
          if (data.status == 201) {
            setStatus(true);
          }
        })
        .catch((data) => console.log(data));
    } catch (error) {}
  };

  const handleCreateUser = (event) => {
    createUser();
    event.preventDefault();
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
    if (!re.test(String(email).toLowerCase())) {
      setEmailError('Некорректный Email');
    } else {
      setEmailError('');
    }
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length > 8) {
      // Пароль имеет достаточную длину (больше 8 символов)
      setPasswordError('');

      // Проверка наличия английских букв
      const hasEnglishLetters = /[a-zA-Z]/.test(e.target.value);
      if (hasEnglishLetters) {
        // Пароль содержит английские буквы
        setPasswordError('');
      } else {
        setPasswordError('Пароль не содержит английских букв');
      }
    } else {
      // Пароль слишком короткий
      setPasswordError(' Пароль имеет менее 8 символов');
    }
  };

  const handleBlur = (e) => {
    switch (e.target.name) {
      case 'email':
        setEmailDirty(true);
        break;
      case 'password':
        setPasswordDirty(true);
        break;
    }
  };

  return (
    <div className={style.registrationForm}>
      <form
        className={style.registrationForm__form}
        onSubmit={handleCreateUser}
      >
        <div className={style.registrationForm__form_firstName}>
          <label htmlFor="firstName">Имя: </label>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>

        <div className={style.registrationForm__form_lastName}>
          <label htmlFor="lastName">Фамилия: </label>
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>

        <div className={style.registrationForm__form_phone}>
          <label htmlFor="phone">Телефон:</label>
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={(event) => setPhone(parseInt(event.target.value))}
          />
        </div>

        {emailDirty && emailError && (
          <div className={style.registrationForm__form_email_error}>
            {emailError}
          </div>
        )}
        <div className={style.registrationForm__form_email}>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => handleEmail(event)}
            onBlur={(e) => handleBlur(e)}
          />
        </div>
        {passwordDirty && passwordError && (
          <div className={style.registrationForm__form_password_error}>
            {passwordError}
          </div>
        )}
        <div className={style.registrationForm__form_password}>
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(event) => handlePassword(event)}
            onBlur={(e) => handleBlur(e)}
          />
        </div>

        <button
          className={style.registrationForm__form_btn}
          type="sumbit"
          disabled={!formValid}
        >
          Регистрация
        </button>
        {status && (
          <p className={style.registrationForm__form_status}>
            Регистрация прошла успешно
          </p>
        )}
      </form>
      <Link to="/auth/login">Вход</Link>
    </div>
  );
};

export default RegistrationForm;
