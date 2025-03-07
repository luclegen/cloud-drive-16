import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import SearchIcon from '@mui/icons-material/Search'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import InfoIcon from '@mui/icons-material/Info'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import Lang from '../../models/Lang'
import {
  selectHover,
  selectWidth,
  selectOpened,
  toggle,
  toggleDropdown,
  search,
  setOpened,
  setWidth,
  selectIsOpen,
  hideDropdown,
  selectFoundFolders,
  selectFoundFiles,
  selectKeyword,
  setKeyword,
  setFoundFiles,
  setFoundFolders
} from './slice'
import {
  list,
  reset,
  selectAll,
  selectFolders
} from '../Files/slice'
import {
  selectLoggedIn,
  logout,
  selectIsActivate,
  selectLang,
  changeLang,
  selectAvatar,
  selectFirstName
} from '../../slice'
import helper from '../../services/helper'

export default function Header() {
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const folders = useSelector(selectFolders)
  const foundFolders = useSelector(selectFoundFolders)
  const foundFiles = useSelector(selectFoundFiles)
  const hover = useSelector(selectHover)
  const width = useSelector(selectWidth)
  const opened = useSelector(selectOpened)
  const isOpen = useSelector(selectIsOpen)
  const avatar = useSelector(selectAvatar)
  const first_name = useSelector(selectFirstName)
  const loggedIn = useSelector(selectLoggedIn)
  const activated = useSelector(selectIsActivate)
  const lang = useSelector(selectLang)
  const keyword = useSelector(selectKeyword)

  const [selected, setSelected] = useState(false)

  useEffect(() => {
    i18n.changeLanguage(lang)
    window.onresize = () => dispatch(setWidth())
    window.onkeydown = e => {
      if (e.ctrlKey && (e.key === 'a' || e.key === 'A')) dispatch(selectAll())
    }
    window.onclick = e => {
      !e.target.closest('.dropdown-toggle-avatar')
        && !e.target.closest('.dropdown-menu-avatar')
        && dispatch(hideDropdown())

      e.target.closest('.dropdown-menu-folder')
        ? (e.target.closest('.dropdown-item-normal') || e.target.closest('.dropdown-item-danger'))
        && document.querySelector('.dropdown-menu-folder')
        && (document.querySelector('.dropdown-menu-folder').style.display = 'none')
        : document.querySelector('.dropdown-menu-folder')
        && (document.querySelector('.dropdown-menu-folder').style.display = 'none')
    }
  }, [lang])

  const coloring = e => {
    if (e.type === 'select') setSelected(true)
    if (e.type === 'blur') setSelected(false)

    if (width > 800) {
      let color = keyword || selected || e.type === 'mouseenter' ? 'white' : '#e1dfdd'

      if (e.type === 'select') color = 'white'
      if (e.type === 'blur' && !keyword) color = '#e1dfdd'
      document.querySelector('.search-bar').style.background = color
    } else if (e.type === 'mouseleave') {
      reset()
      dispatch(setOpened(false))
    }
  }

  const getSearchBar = () => document.querySelector('.search-bar')

  const getSearchIn = () => document.querySelector('.input-search')

  const getSearchBtn = () => document.querySelector('.btn-search')

  const open = e => {
    e.preventDefault()

    if (width < 801) {
      getSearchBar().style.position = 'absolute'
      getSearchBar().style.width = '100%'
      getSearchBar().style.left = '0'
      getSearchBar().style.background = 'white'
      getSearchIn().style.display = 'block'
      getSearchIn().focus()
      getSearchBtn().style.color = 'blue'

      dispatch(setOpened(true))
    }

    navigate(`/?keyword=${keyword}`)
    dispatch(list())
    dispatch(setFoundFolders([]))
    dispatch(setFoundFiles([]))
  }

  const access = e => {
    if (/folder/g.test(e.target.className)) {
      navigate(`?id=${e.target.id}`)
    } else if (/file/g.test(e.target.className)) {
      navigate(`?id=${e.target.value === '/' ? 'root' : folders.find(v => helper.toPath(v) === e.target.value)._id}${e.target.getAttribute('data-trash') === 'true' ? '&location=trash' : ''}${helper.isMedia(e.target.name) ? `&fid=${e.target.id}` : ''}`)
      if (helper.isPDF(e.target.name)) window.open(`${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/media/?path=${helper.getCookie('id')}/files${e.target.value === '/' ? '/' : e.target.value + '/'}${e.target.name}`)
    }

    dispatch(list())
      .then(action => {
        if (action.type === 'files/list/fulfilled') {
          dispatch(setFoundFolders([]))
          dispatch(setFoundFiles([]))
        }
      })
  }

  return <header>
    <Link className="logo" to={`/${loggedIn && activated ? '?id=root' : ''}`} onClick={() => loggedIn && activated && dispatch(list())} onMouseEnter={() => dispatch(toggle())} onMouseLeave={() => dispatch(toggle())}>
      <img className={`logo-img ${width > 560 && 'me-1'}`} src="/logo.svg" alt="Logo" hidden={hover} />
      <img className={`logo-img ${width > 560 && 'me-1'}`} src="/logo.hover.svg" alt="Hover logo" hidden={!hover} />
      {width > 560 && process.env.REACT_APP_NAME}
    </Link>
    {loggedIn && activated && <div className="search-bar" onMouseEnter={coloring} onMouseLeave={coloring} onInput={e => { dispatch(search(e.target.value)) }}>
      <form className="form-search">
        <button className="btn-search" type={width > 800 ? 'submit' : opened && keyword ? 'submit' : 'button'} disabled={width > 800 && !keyword} onClick={open}>
          <SearchIcon />
        </button>
        <input className="input-search" name="keyword" type="search" value={keyword} placeholder={t('Search for anything')} onSelect={coloring} onBlur={coloring} onInput={e => dispatch(setKeyword(e.target.value))} />
      </form>
      <div className="list-group-search">
        {foundFolders?.map((v, i) => <button type="button" className="list-group-item-folder" id={v._id} key={i} onClick={access}>
          <img className="folder" src="/svgs/folder.svg" alt="Folder" /> &nbsp;&nbsp;{v.name}
        </button>)}
        {foundFiles?.map((v, i) => <button type="button" className="list-group-item-file" id={v._id} key={i} name={v.name} value={v.path} data-trash={v.is_trash} onClick={access}>
          <i className="material-icons">{helper.isImage(v.name) ? 'image' : helper.isVideo(v.name) ? 'video_file' : helper.isAudio(v.name) ? 'audio_file' : 'description'}</i>&nbsp;&nbsp;{v.name}
        </button>)}
      </div>
    </div>}
    <div className="dropdown dropdown-avatar">
      {loggedIn
        ? <button className="dropdown-toggle dropdown-toggle-avatar" title={first_name} onClick={() => dispatch(toggleDropdown())}>
          {avatar
            ? <img className="avatar-img" src={helper.getAvatar(avatar)} alt={`${first_name}'s avatar`} />
            : <AccountCircleIcon className="icon-header" />}
        </button>
        : <a className="link-help" title={t('Help')} href="/help" target="_blank">
          <HelpOutlineIcon className="icon-header" />
        </a>}
      {isOpen && <ul className="dropdown-menu dropdown-menu-avatar">
        <Link className="dropdown-item-normal dropdown-item" to="/profile/information" onClick={() => dispatch(hideDropdown())}><p className="text-profile">{t('My profile')}</p><InfoIcon /></Link>
        <hr className="dropdown-divider" />
        <Link className="dropdown-item-normal dropdown-item" to="/help" onClick={() => dispatch(hideDropdown())}><p className="text-help">{t('Help')}</p><HelpOutlineIcon /></Link>
        <hr className="dropdown-divider" />
        <li className="dropdown-item-normal dropdown-item" onClick={() => dispatch(changeLang(lang === Lang.VI ? Lang.EN : Lang.VI))}><p className="text-language">{lang === Lang.VI ? 'English' : 'Tiếng Việt'}</p>{lang === Lang.VI ? <img src="/images/United States.png" alt="United States image" /> : <img src="/images/Vietnam.png" alt="Vietnam image" />}</li>
        <Link className="dropdown-item-danger dropdown-item" to="/" onClick={() => dispatch(reset()) && dispatch(logout()) && dispatch(hideDropdown())}><p className="text-logout">{t('Sign out')}</p><LogoutIcon /></Link>
      </ul>}
    </div>
  </header>
}
