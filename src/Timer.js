import React from 'react'

class Timer extends React.Component {
    constructor (props) {
      super(props)

      this.tick = this.tick.bind(this)
      this.displayTime = this.displayTime.bind(this)
      this.changeTime = this.changeTime.bind(this)
      
      this.state = {
          timeLeft: 1500,
          break: 5,
          session: 25,
          cycle: 1,
          timerState: 'stopped',
          mode: 'Session',
          display: '',
        }
    }

    componentDidMount () {
        this.setState({
            timeLeft: (this.state.session * 60),
            display: this.displayTime(this.state.timeLeft)
        }, () => {
            this.displayTime(this.state.timeLeft)
        })
    }

    componentWillUnmount () {
      clearInterval(this.timer)
    }

    tick () {
        if(this.state.timeLeft === 1) {
            this.beep.play();
        }
      this.setState({
          timeLeft: (this.state.timeLeft - 1)
        }, () => (this.displayTime(this.state.timeLeft)))
        if(this.state.timeLeft < 0) {
            clearInterval(this.timer)
            this.reachZero()
            return
          }
    }

    startTimer () {
      clearInterval(this.timer)
      this.timer = setInterval(this.tick, 1000)
      this.setState({
        timerState: 'started',
      }, () => (this.displayTime(this.state.timeLeft)))
    }

    stopTimer () {
      clearInterval(this.timer)
      this.setState({
        timerState: 'stopped',
      }, () => (this.displayTime(this.state.timeLeft)))
    }

    reset = () => {
        this.stopTimer()
        this.beep.pause();
        this.beep.currentTime = 0;
        this.setState({
            timeLeft: (this.state.session * 60),
            display: this.displayTime(this.state.timeLeft),
            timerState: 'stopped',
            cycle: 1,
            break: 5,
            session: 25,
            mode: 'Session',
          }, () => {this.changeTime()})
    }

    displayTime = (seconds) => {
        let mins = Math.floor(seconds / 60)
        let secs = seconds % 60
        mins = mins < 10 ? "0" + mins : mins;
        secs = secs < 10 ? "0" + secs : secs;
        let display = `${mins}:${secs}`
        this.setState({
          display: display,
        })
        return display
    }

    decreaseSession = () => {
        if(this.state.session > 1) {
        this.setState({
           session: (this.state.session - 1),
        }, () => {this.changeTime()}) 
        this.changeTime()
    } else {
        this.setState({
                session: 1,
             })
        }
    }
    
    increaseSession = (e) => {
        if (this.state.timerState === 'stopped') {
            this.setState({
                display: this.state.session,
            })
        }
        if(this.state.session <= 59) {
        this.setState({
            session: (this.state.session + 1),
            display: this.displayTime(this.state.timeLeft)
         }, () => {this.changeTime()})
        } else {
            this.setState({
                session: 60,
            }, () => {this.changeTime()})
        }
    }

    decreaseBreak = () => {
        if(this.state.break > 1) {
            this.setState({
               break: (this.state.break - 1),
            }, () => {this.changeTime()}) 
            this.changeTime()
        } else {
            this.setState({
                    break: 1,
                 })
            }
        }
        
    increaseBreak = () => {
        if(this.state.break <= 59) {
        this.setState({
            break: (this.state.break + 1),
        }, () => {this.changeTime()})
    } else {
        this.setState({
            break: 60,
        }, () => {this.changeTime()})
    }
    }

    changeTime = () => {
        if (this.state.mode === "Session") {
           this.setState({
               timeLeft: (this.state.session * 60),
           }, () => {this.displayTime(this.state.timeLeft)}) 
        } else {
            this.setState({
                timeLeft: (this.state.break * 60),
            }, () => {this.displayTime(this.state.timeLeft)}) 
        }
    }

    reachZero = () => {
        if (this.state.mode === 'Session') {
            this.setState({
                timeLeft: (this.state.break * 60),
                mode: 'Break',
            }, () => {this.displayTime(this.state.timeLeft)})
            
        } else { if (this.state.mode === 'Break') {
            this.setState({
                timeLeft: (this.state.session * 60),
                mode: 'Session',
                cycle: this.state.cycle + 1,
            }, () => {this.displayTime(this.state.timeLeft)})
        }
    }
    this.startTimer()
    }

    render () {
      return (
        <div className="app">
        <div className="clock">
            <h1>Pomodoro Clock</h1>
          <h1 id="time-left">{this.state.display}</h1>
          <div id="timer-label">{this.state.mode} {this.state.cycle}</div>
            <div className="buttons">
                <button id="start_stop" onClick={this.state.timerState === 'stopped' ? this.startTimer.bind(this) : this.stopTimer.bind(this)}>Start/Stop</button>
                <button id="reset" onClick={this.reset}>Reset</button>
            </div>
          <div className="break-session">
            <div className="session">
              <div id="session-length">{this.state.session}</div>
              <div id='session-label'>Session length</div>
              <button id='session-decrement' onClick={this.decreaseSession}>-</button>
              <button id='session-increment' onClick={this.increaseSession}>+</button>
            </div>
            <div className="break">
              <div id="break-length">{this.state.break}</div>
              <div id='break-label'>Break length</div>
              <button id='break-decrement' onClick={this.decreaseBreak}>-</button>
              <button id='break-increment' onClick={this.increaseBreak}>+</button>
            </div>
          </div>
          <audio id="beep" preload="auto" 
          src="https://goo.gl/65cBl1"
          type="audio/mpeg"
          ref={(audio) => { this.beep = audio; }} />
        </div>
      </div>
      )
    }
  }

export default Timer