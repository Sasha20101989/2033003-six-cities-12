import { Link } from 'react-router-dom';
import useLoginForm from '../../hooks/use-login-form/use-login-form';
import HeaderLogo from '../../components/header/header-logo';

function LoginScreen() : JSX.Element {
  const { loginRef, passwordRef, isSubmitting, handleSubmit, handleGoMainClick } = useLoginForm();

  return(
    <div className="page page--gray page--login">
      <header className="header"> 
        <div className="container">
          <div className="header__wrapper">
            <HeaderLogo onGoMainClick={handleGoMainClick}/>
          </div>
        </div>
      </header>

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" action="" onSubmit={handleSubmit}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input ref={loginRef} className="login__input form__input" type="email" name="email" placeholder="Email" required/>
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input ref={passwordRef} className="login__input form__input" type="password" name="password" placeholder="Password" required/>
              </div>
              <button className="login__submit form__submit button" type="submit" disabled={isSubmitting}>Sign in</button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <Link className="locations__item-link" to="#">
                <span>Amsterdam</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
export default LoginScreen;
