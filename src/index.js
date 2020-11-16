import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import ThemeContext from './core/ThemeContext'
import App from './App'
import reportWebVitals from './reportWebVitals'

class ThemeHelper extends React.Component {
  constructor(props) {
    super(props)

    this._toggleTheme = () => {
      this.setState(state => ({
        theme: state.theme === 'dark' ? 'light' : 'dark'
      }));
    };

    // State also contains the updater function so it will
    // be passed down into the context provider
    this.state = {
      theme: 'light',
      _toggleTheme: this._toggleTheme,
    };
  }

  render() {
    // The entire state is passed to the provider
    return (
        <ThemeContext.Provider value={this.state}>
          {this.props.children}
        </ThemeContext.Provider>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeHelper>
        <App/>
      </ThemeHelper>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
