import { Component } from 'react'
import helper from '../../services/helper'

export default class Activate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      code: ''
    }
  }

  enterNumber = e => {
    const ins = Array.from(document.querySelector('.form-row-number').children)
    const i = ins.findIndex(i => i === e.target)
    const input = document.querySelectorAll('.form-control-number')

    if (e.target.value.length > 1) return input[i].value = e.target.value[0]
    if (i < 5 && helper.isDigit(input[i].value) && input[i].value.length === 1) input[i + 1].focus()
    if (this.isSubmit()) this.onSubmit(e)
  }

  clearNumber = e => {
    const ins = Array.from(document.querySelector('.form-row-number').children)
    const i = ins.findIndex(i => i === e.target)
    const input = document.querySelectorAll('.form-control-number')

    if (e.keyCode === 8 && i > 0 && e.target.value === '') input[i - 1].focus()
  }

  pasteNumber = e => {
    const ins = Array.from(document.querySelector('.form-row-number').children)
    const i = ins.findIndex(i => i === e.target)
    const input = document.querySelectorAll('.form-control-number')

    const txt = (e.clipboardData || window.clipboardData).getData('text')
    const max = txt.length > 6 - i ? 6 - i : txt.length
    const f = max + i > 5 ? 5 : max + i

    setTimeout(() => {
      input[i].value = helper.isDigit(txt[0]) ? txt[0] : null
      if (helper.isCode(txt)) input[f].focus()
    })

    for (let j = i, k = 0; k < max; j++, k++) input[j].value = helper.isDigit(txt[k]) ? txt[k] : null

    if (this.isSubmit()) this.onSubmit(e)
  }

  isSubmit = () => '0'.repeat(6).split('').map((v, i) => v = document.querySelectorAll('.form-control-number')[i].value).filter(v => helper.isDigit(v)).length === 6

  onSubmit = e => {
    e.preventDefault()

    console.log('submit');
  }

  render = () => <section className="section-only">
    <form className="form-only" onSubmit={this.onSubmit}>
      <img className='logo-img' src="/logo.png" alt={process.env.REACT_APP_CLIENT_NAME + ' logo'} />
      <h1 className="h1-only">Activate your account</h1>
      <div className="form-row-number">
        {'0'.repeat(6).split('').map((v, i) => <input className="form-control-number" key={i} type="number" maxLength="1" onInput={this.enterNumber} onDrop={this.enterNumber} onKeyUp={this.clearNumber} onKeyDown={this.clearNumber} onPaste={this.pasteNumber} required />)}
      </div>
    </form>
  </section>
}