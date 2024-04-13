import images from '~/assets/images';
import style from './Profile.module.scss';
import classNames from 'classnames/bind';
import {
  PasswordIcon,
  PersonalInfoIcon,
  HelpIcon,
  TermsOfUseIcon,
  ArrowDownIcon,
  EyeIcon,
  HideIcon,
} from '~/components/Icons';
import Button from '~/components/Button';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserById, getUser } from '~/apiService/userService';
import Loader from '~/components/Loader';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'flatpickr/dist/flatpickr.css';
import Flatpickr from 'react-flatpickr';
import moment from 'moment';
import { changePassword } from '~/apiService/authService';
import { reFreshStatus } from '~/features/authSlice';
const cx = classNames.bind(style);

function Profile() {
  const [userInfo, setUserInfo] = useState();
  const [isChange, setIsChange] = useState(false);
  const [gender, setGender] = useState(userInfo?.gender);
  const [isShowGender, setIsShowGender] = useState(false);
  const [fullName, setFullName] = useState(userInfo?.fullname);
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phone);
  const [msv, setMsv] = useState(userInfo?.msv);
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState(userInfo?.email);
  const [imageSelected, setImageSelected] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [date, setDate] = useState([userInfo?.dateOfBirth ? new Date(userInfo?.dateOfBirth) : null]);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
    oldPassword: false,
  });
  const reduxData = useSelector((prop) => prop.user);
  const reduxChangePassword = useSelector((prop) => prop.auth);
  const { t } = useTranslation();

  useEffect(() => {
    if (selectedOption === listOptions[1].title) {
      setIsLoading(reduxData.loading);
    } else if (selectedOption === listOptions[2].title) {
      setIsLoading(reduxChangePassword.loading);
    }
    //eslint-disable-next-line
  }, [reduxData.loading, reduxChangePassword.loading]);

  const handleEyeIconClick = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const dispatch = useDispatch();

  const inputRefs = {
    fullName: useRef(null),
    email: useRef(null),
    phoneNumber: useRef(null),
    msv: useRef(null),
    avatar: useRef(null),
    oldPassword: useRef(null),
    newPassword: useRef(null),
    confirmPassword: useRef(null),
  };

  const listOptions = [
    {
      title: t('profile.navTitle01'),
      icon: <div className={cx('special-icon')}></div>,
      isTitle: true,
    },
    {
      title: t('profile.nav01'),
      icon: <PersonalInfoIcon className={cx('icon')} />,
      navId: 'personalInfo',
    },
    {
      title: t('profile.nav02'),
      icon: <PasswordIcon className={cx('icon')} />,
      navId: 'changePassword',
    },
    {
      title: t('profile.navTitle02'),
      icon: <div className={cx('special-icon')}></div>,
      isTitle: true,
    },
    {
      title: t('profile.nav03'),
      icon: <HelpIcon className={cx('icon')} />,
      navId: 'help',
    },
    {
      title: t('profile.nav04'),
      icon: <TermsOfUseIcon className={cx('icon')} />,
      navId: 'termsOfUse',
    },
  ];

  const [selectedOption, setSelectedOption] = useState(listOptions[1].title);

  const upDateUserInfo = () => {
    setUserInfo(reduxData.user);
    setEmail(reduxData.user?.email ?? '');
    setFullName(reduxData.user?.fullname ?? '');
    setMsv(reduxData.user?.msv || '');
    setPhoneNumber(reduxData.user?.phone || '');
    setDate([reduxData.user?.dateOfBirth ? new Date(reduxData.user?.dateOfBirth) : null]);
    setGender(reduxData.user?.gender ?? 'male');
    setIsChange(false);
    setImagePreview(null);
    setImageSelected(null);

    setOldPassword('');
    setConfirmPassword('');
    setNewPassword('');

    setErrors({});
  };

  useEffect(() => {
    if (reduxChangePassword.status === 200) {
      toast.success('Đổi mật khẩu thành công');
      upDateUserInfo();
      dispatch(reFreshStatus());
    } else if (reduxChangePassword.status === 401) {
      toast.error('Mật khẩu không đúng');
      dispatch(reFreshStatus());
    }
  }, [reduxChangePassword.status]);

  //call api and assign userInfo when first mounted
  useEffect(() => {
    // console.log('call api');
    dispatch(getUser());
    upDateUserInfo();
    //eslint-enable-next-line
  }, []);

  useEffect(() => {
    // console.log('UserInfo', userInfo);
    if (!reduxData.isUpdate) {
      upDateUserInfo();
    } else if (reduxData.loading === false && reduxData.error === null && reduxData.isUpdate) {
      toast.success(t('profile.toast.successed'));
      upDateUserInfo();
    } else if (reduxData.loading === false && reduxData.error !== null && reduxData.isUpdate) {
      toast.error(t('profile.toast.error'));
      upDateUserInfo();
    }
    //eslint-disable-next-line
  }, [reduxData]);

  // handle when update
  const handleUpdate = async () => {
    const isPersonalInfo = selectedOption === listOptions[1].title;

    validateInputs();
    validateDate(date);
    setIsShowGender(false);
    let isChange = true;
    let hasChanged = true;
    Object.values(errors).forEach((error) => {
      console.log(error);
      if (error !== '') {
        isChange = false;
        return;
      }
    });

    // console.log('start date', date);
    // // console.log('dateOfBirth', new Date(userInfo.dateOfBirth));
    // // console.log(startDate.getTime() === new Date(userInfo.dateOfBirth).getTime());

    if (!isPersonalInfo) {
      if (oldPassword === '' || oldPassword === '' || confirmPassword === '') {
        toast.error('vui long hap day du cac truong');
      } else if (!isChange) {
        toast.error(t('profile.toast.noExactly'));
      } else {
        const data = {
          oldPassword: oldPassword,
          newPassword: newPassword,
        };
        dispatch(changePassword(data));
      }
    }

    if (isPersonalInfo) {
      if (
        fullName === userInfo?.fullname &&
        phoneNumber === (userInfo?.phone || '') &&
        msv === (userInfo?.msv || '') &&
        gender === (userInfo?.gender === 'male' ? 'male' : 'female') &&
        date[0].getTime() === new Date(userInfo.dateOfBirth).getTime() &&
        imageSelected === null
      ) {
        toast.info(t('profile.toast.noChanged'));
        hasChanged = false;
        return;
      }

      if (isChange && hasChanged) {
        const data = {
          fullname: fullName,
          gender: gender,
          dateOfBirth: date[0],
          // phone: phoneNumber,
          // msv: msv,
        };
        dispatch(updateUserById({ userData: data, avatar: imageSelected }));
      } else {
        toast.error(t('profile.toast.noExactly'));
      }
    }
  };

  //handle when selected image
  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    // console.log('selected image');
    setImageSelected(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      try {
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error reading the file:', error);
        toast.error('Đã xảy ra lỗi khi đọc file.');
      }
    }
  };

  useEffect(() => {
    handleCancel();
    if (!(selectedOption === listOptions[1].title)) {
      setIsChange(true);
    } else {
      setIsChange(false);
    }
    setShowPassword({
      newPassword: false,
      confirmPassword: false,
      oldPassword: false,
    });
    upDateUserInfo();
    //eslint-disable-next-line
  }, [selectedOption]);

  const handleCancel = () => {
    // {
    //   // setFullName(userInfo?.fullname || '');
    //   // setMsv(userInfo?.MSV || '');
    //   // setPhoneNumber(userInfo?.phone || '');
    //   // setEmail(userInfo?.email || '');
    //   // setGender(
    //   //   userInfo?.gender
    //   //     ? userInfo.gender.toLowerCase() === 'male'
    //   //       ? t('profile.gender.male')
    //   //       : t('profile.gender.female')
    //   //     : '',
    //   // );
    // }
    upDateUserInfo();

    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword({
      newPassword: false,
      confirmPassword: false,
      oldPassword: false,
    });

    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    console.log(name);
    switch (name) {
      case 'fullName':
        setFullName(value);
        setErrors((preErr) => ({ ...preErr, fullName: '' }));
        break;
      case 'phoneNumber':
        if (/^\d*$/.test(value)) {
          setPhoneNumber(value);
          setErrors((preErr) => ({ ...preErr, phoneNumber: '' }));
        }
        break;
      case 'msv':
        if (/^\d*$/.test(value)) {
          // console.log(value.length);
          if (value.length > 10) {
            setErrors((preErr) => ({ ...preErr, msv: 'Mã sinh viên tối đa 10 ký tự' }));
            break;
          }
          // console.log('msv', value);
          setMsv(value);
          setErrors((preErr) => ({ ...preErr, msv: '' }));
        }
        break;

      case 'oldPassword':
        setOldPassword(value);
        setErrors((preErr) => ({ ...preErr, oldPassword: '' }));
        break;

      case 'newPassword':
        setNewPassword(value);
        setErrors((preErr) => ({ ...preErr, newPassword: '' }));
        break;

      case 'confirmPassword':
        setConfirmPassword(value);
        setErrors((preErr) => ({ ...preErr, confirmPassword: '' }));
        break;

      default:
        break;
    }
  };

  const validateInputs = () => {
    let newErrors = {};
    const fullName = inputRefs.fullName.current?.value ?? '';
    const phoneNumber = inputRefs.phoneNumber.current?.value ?? '';
    const msv = inputRefs.msv.current?.value ?? '';
    const oldPassword = inputRefs.oldPassword.current?.value ?? '';
    const newPassword = inputRefs.newPassword.current?.value ?? '';
    const confirmPassword = inputRefs.confirmPassword.current?.value ?? '';
    // console.log(oldPassword);
    // console.log(fullName, phoneNumber, msv);

    if (selectedOption === listOptions[1].title) {
      if (fullName.trim() === '') {
        newErrors = { ...newErrors, fullName: t('errors.fullName.err01') };
      }

      if (phoneNumber.trim() === '') {
        newErrors = { ...newErrors, phoneNumber: '' };
      } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phoneNumber)) {
        newErrors = { ...newErrors, phoneNumber: t('errors.phoneNumber.err02') };
      }

      if (msv.trim() === '') {
        newErrors = { ...newErrors, msv: '' };
      } else if (msv.trim().length !== 10) {
        newErrors = { ...newErrors, msv: t('errors.msv.err02') };
      } else {
        const currentYear = new Date().getFullYear();
        const firstFourDigits = parseInt(msv.trim().substring(0, 4), 10);
        if (firstFourDigits > currentYear) {
          newErrors = { ...newErrors, msv: t('errors.msv.err04') };
        } else if (firstFourDigits < currentYear - 6) {
          newErrors = { ...newErrors, msv: t('errors.msv.err03') };
        }
      }
    }

    if (oldPassword === '') {
      newErrors = { ...newErrors, oldPassword: '' };
    } else if (!/^(?=.*[@-_]).{8,}$/.test(oldPassword)) {
      newErrors = { ...newErrors, oldPassword: 'Mật khẩu phải có ít nhất 8 ký tự và ít nhất 1 ký tự đặc biệt' };
    }

    if (newPassword === '') {
      newErrors = { ...newErrors, newPassword: '' };
    } else if (!/^(?=.*[@-_]).{8,}$/.test(newPassword)) {
      newErrors = { ...newErrors, newPassword: 'Mật khẩu phải có ít nhất 8 ký tự và ít nhất 1 ký tự đặc biệt' };
    }

    if (confirmPassword === '') {
      newErrors = { ...newErrors, confirmPassword: '' };
    } else if (confirmPassword !== newPassword) {
      newErrors = { ...newErrors, confirmPassword: 'Mật khẩu xác nhận không khớp' };
    }

    setErrors(newErrors);
  };

  const validateDate = (date) => {
    let newErrors = { ...errors };
    console.log('on change', date);

    if (!moment(date[0], 'DD.MM.YYYY', true).isValid()) {
      console.log('khong hop le');
      newErrors = { ...newErrors, birthDay: t('errors.birthDay.err05') };
    } else {
      const today = moment();
      const birthDay = moment(date[0], 'DD.MM.YYYY', true);
      // console.log(moment(date, 'DD.MM.YYYY', true));
      const age = today.diff(birthDay, 'years');
      // console.log('age', age);

      if (age < 0) {
        newErrors = { ...newErrors, birthDay: t('errors.birthDay.err02') };
      } else if (age < 18) {
        newErrors = { ...newErrors, birthDay: t('errors.birthDay.err03') };
      } else if (age > 100) {
        newErrors = { ...newErrors, birthDay: t('errors.birthDay.err04') };
      } else {
        newErrors = { ...newErrors, birthDay: '' };
      }
    }
    setDate(date);
    setErrors(newErrors);
  };

  const handleDateChange = (date) => {
    // console.log(date);
    validateDate(date);
  };

  //   const value = datePickerRef.current.input.value;
  //   console.log(value);

  //   const [day, month, year] = value.split('/');
  //   const inputDate = new Date(`${year}-${month}-${day}`);
  //   const currentDay = new Date();
  //   let newErrors = { ...errors }; // Sao chép errors hiện tại để thay đổi
  //   // console.log('start date', startDate.getFullYear());
  //   // console.log('4 year', year.toString().length === 4);
  //   // console.log('18 year', currentDay.getFullYear() - year < 18);

  //   if (inputDate instanceof Date && !isNaN(inputDate) && year?.toString().length === 4) {
  //     console.log('intant of date');
  //     setStartDate(inputDate);
  //   } else {
  //     return;
  //   }
  //   if (!(inputDate instanceof Date)) {
  //     return (newErrors = { ...newErrors, birthDay: 'Ngày sinh không hợp lệ' });
  //     // console.log('ngay sinh khong hop le');
  //   } else if (inputDate > currentDay) {
  //     newErrors = { ...newErrors, birthDay: 'Ngày sinh không thể lớn hơn hôm nay' };
  //     console.log('ngay sinh khong the lon hon ngay hom nay');
  //   } else if (year && year.toString().length === 4 && currentDay.getFullYear() - year < 18) {
  //     newErrors = { ...newErrors, birthDay: 'Bạn chưa đủ 18 tuổi' };
  //     console.log('ngay sinh khong the lon hon 18 tuoi');
  //   } else if (currentDay.getFullYear() - 100 > year && year === startDate?.getFullYear().toString()) {
  //     newErrors = { ...newErrors, birthDay: 'Bạn đã quá 100 tuổi' };
  //     console.log('ngay sinh khong the lon hon 100 tuoi');
  //   } else {
  //     newErrors = { ...newErrors, birthDay: '' }; // Không có lỗi
  //   }

  //   setErrors(newErrors);
  // };

  // console.log(image);
  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <div className={cx('row profile')}>
          {/* sidebar */}
          <div className={cx('col-xl-3')}>
            <div className={cx('profile__img-container')}>
              <img
                className={cx('profile__img-cover')}
                src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="hauifood"
              />
              <div
                // listOption[1].title là "Personal info"
                className={cx('profile__img-content', {
                  'no-change': !isChange || selectedOption !== listOptions[1].title,
                })}
              >
                <div className={cx('profile__avatar-container')}>
                  <img
                    className={cx('profile__img')}
                    src={imagePreview ? imagePreview : userInfo?.avatar ? userInfo.avatar : images.avatarDefault}
                    alt="hauifood"
                  />
                  <div
                    className={cx('select-image-btn')}
                    onClick={() => {
                      inputRefs.avatar.current.click();
                    }}
                  >
                    <input
                      ref={inputRefs.avatar}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onInput={(e) => {
                        handleSelectImage(e);
                      }}
                    />
                    <div className={cx('profile__select-img-title')}>{t('profile.btn-select-img')}</div>
                  </div>
                </div>
                <div className={cx('profile__user-name')}>{userInfo?.fullname ? userInfo.fullname : 'HauiFood'}</div>
                <div className={cx('profile__registered-day')}>Registered: 20th May 2024</div>
              </div>
            </div>

            <div className={cx('profile-nav-container')}>
              <ul className={cx('profile-nav')}>
                {listOptions.map((item, index) => {
                  return (
                    <li key={index}>
                      {item.isTitle && <Button className={cx('profile-nav__title')}>{item.title}</Button>}

                      {!item.isTitle && (
                        <Button
                          className={cx('profile-nav__item', {
                            'profile-nav__item-active': item.title === selectedOption,
                          })}
                          leftIcon={item.icon}
                          onClick={() => {
                            if (isLoading) {
                              return;
                            }
                            setSelectedOption(item.title);
                          }}
                        >
                          {item.title}
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* main content */}
          <div className={cx('col-xl-9')}>
            <div className={cx('profile-content-container', { onLoader: isLoading })}>
              {isLoading && <Loader className={cx('loader')} />}
              {!isLoading && (
                <div className={cx('profile-content')}>
                  <div
                    // listOption[1].title là "Personal info"
                    className={cx('profile-input-container', {
                      'no-personal-info': selectedOption !== listOptions[1].title,
                    })}
                  >
                    <div className={cx('profile-content__title')}>{selectedOption}</div>
                    {selectedOption === listOptions[1].title && <div className={cx('profile__sub-row')}></div>}

                    {/* personal infor */}
                    {selectedOption === listOptions[1].title && (
                      <>
                        {/* full name */}
                        <div className={cx('profile-input-group', { 'no-change': !isChange })}>
                          <label className={cx('profile-input-group__label')} htmlFor="fullName">
                            {t('profile.fullName')}
                          </label>
                          <input
                            ref={inputRefs.fullName}
                            className={cx('profile__input', { isError: errors.fullName })}
                            type="text"
                            name="fullName"
                            // id="fullName"
                            placeholder={t('profile.fullName')}
                            value={fullName}
                            onChange={(e) => {
                              handleInputChange(e);
                              validateInputs();
                            }}
                            onBlur={validateInputs}
                          />
                          {errors.fullName && <div className={cx('errors-message')}>{errors.fullName}</div>}
                          <div className={cx('placeholder-fake')}></div>
                        </div>

                        {/* email */}
                        <div className={cx('profile-input-group', 'no-change')}>
                          <label className={cx('profile-input-group__label')} htmlFor="email">
                            {t('profile.email')}
                          </label>
                          <input
                            className={cx('')}
                            type="text"
                            name="email"
                            // id="email"
                            placeholder="Email"
                            value={email}
                          />
                        </div>

                        {/* phone number */}

                        <div className={cx('profile-input-group', { 'no-change': !isChange })}>
                          <label className={cx('profile-input-group__label')} htmlFor="phoneNumber">
                            {t('profile.phoneNumber')}
                          </label>
                          <input
                            ref={inputRefs.phoneNumber}
                            className={cx({ isError: errors.phoneNumber })}
                            type="text"
                            name="phoneNumber"
                            id="phone-number"
                            placeholder={t('profile.phoneNumber')}
                            value={phoneNumber}
                            onChange={(e) => {
                              handleInputChange(e);
                              validateInputs();
                            }}
                            onBlur={validateInputs}
                          />
                          {errors.phoneNumber && <div className={cx('errors-message')}>{errors.phoneNumber}</div>}
                          <div className={cx('placeholder-fake')}></div>
                        </div>

                        {/* msv */}

                        <div className={cx('profile-input-group', { 'no-change': !isChange })}>
                          <label className={cx('profile-input-group__label')} htmlFor="msv">
                            {t('profile.msv')}
                          </label>
                          <input
                            ref={inputRefs.msv}
                            className={cx({ isError: errors.msv })}
                            type="text"
                            max={10}
                            name="msv"
                            placeholder={t('profile.msv')}
                            value={msv}
                            onChange={(e) => {
                              handleInputChange(e);
                              validateInputs();
                            }}
                            onBlur={validateInputs}
                          />
                          {errors.msv && <div className={cx('errors-message')}>{errors.msv}</div>}
                        </div>

                        {/* Birth day */}
                        <div className={cx('profile-input-group', { 'no-change': !isChange })}>
                          <label className={cx('profile-input-group__label')} htmlFor="birth-day">
                            {t('profile.birthDay')}
                          </label>
                          <div className={cx('date-picker-container')}>
                            <Flatpickr
                              value={date}
                              className={cx('date-picker', { 'no-change': !isChange })}
                              placeholder={t('profile.birthDay')}
                              options={{
                                dateFormat: 'd/m/Y',
                                // allowInput: true,
                                // maxDate: new Date(),
                                disableMobile: true,
                              }}
                              onBlur={(e) => {
                                validateDate(date);
                              }}
                              onChange={(dateSelect) => {
                                handleDateChange(dateSelect);
                              }}
                            />
                          </div>
                          {errors.birthDay && <div className={cx('errors-message')}>{errors.birthDay}</div>}
                        </div>

                        {/* Gender */}
                        <div className={cx('profile-input-group', { 'no-change': !isChange })}>
                          <label className={cx('profile-input-group__label')}>{t('profile.gender.title')}</label>
                          <div
                            className={cx('gender-container')}
                            onClick={() => {
                              setIsShowGender(!isShowGender);
                            }}
                          >
                            <div className={cx('gender__selected-value')}>
                              {gender
                                ? gender === 'male'
                                  ? t('profile.gender.male')
                                  : t('profile.gender.female')
                                : t('profile.gender.title')}
                            </div>
                            <ArrowDownIcon className={cx('gender__icon')} />
                            <ul
                              className={cx('gender__options', { isShow: isShowGender })}
                              onClick={() => {
                                setIsShowGender(!isShowGender);
                              }}
                            >
                              <li
                                className={cx('gender__option')}
                                onClick={() => {
                                  setGender('male');
                                }}
                              >
                                {t('profile.gender.male')}
                              </li>
                              <li
                                className={cx('gender__option')}
                                onClick={() => {
                                  setGender('female');
                                }}
                              >
                                {t('profile.gender.female')}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </>
                    )}

                    {/* change password */}
                    {selectedOption === listOptions[2].title && (
                      <>
                        {/* old password */}
                        <div className={cx('profile-input-group')}>
                          <label className={cx('profile-input-group__label')}>
                            {t('profile.oldPassword')}
                            <input
                              ref={inputRefs.oldPassword}
                              className={cx({ isError: errors.oldPassword })}
                              type={showPassword.oldPassword ? 'text' : 'password'}
                              name="oldPassword"
                              placeholder={t('profile.oldPassword')}
                              value={oldPassword}
                              onChange={(e) => {
                                handleInputChange(e);
                                validateInputs();
                              }}
                              onBlur={validateInputs}
                            />
                            {oldPassword && (
                              <div
                                onClick={() => {
                                  handleEyeIconClick('oldPassword');
                                }}
                              >
                                {!showPassword.oldPassword ? (
                                  <EyeIcon className={cx('eye-icon')} />
                                ) : (
                                  <HideIcon className={cx('eye-icon')} />
                                )}
                              </div>
                            )}
                          </label>
                          {errors.oldPassword && <div className={cx('errors-message')}>{errors.oldPassword}</div>}
                        </div>

                        {/* new password */}
                        <div className={cx('profile-input-group')}>
                          <label className={cx('profile-input-group__label')}>
                            {t('profile.newPassword')}
                            <input
                              ref={inputRefs.newPassword}
                              className={cx({ isError: errors.newPassword })}
                              type={showPassword.newPassword ? 'text' : 'password'}
                              name="newPassword"
                              placeholder={t('profile.newPassword')}
                              value={newPassword}
                              onChange={(e) => {
                                handleInputChange(e);
                                validateInputs();
                              }}
                              onBlur={validateInputs}
                            />
                            {newPassword && (
                              <div
                                onClick={() => {
                                  handleEyeIconClick('newPassword');
                                }}
                              >
                                {!showPassword.newPassword ? (
                                  <EyeIcon className={cx('eye-icon')} />
                                ) : (
                                  <HideIcon className={cx('eye-icon')} />
                                )}
                              </div>
                            )}
                          </label>
                          {errors.newPassword && <div className={cx('errors-message')}>{errors.newPassword}</div>}
                        </div>

                        {/* confirm password */}
                        <div className={cx('profile-input-group')}>
                          <label className={cx('profile-input-group__label')}>
                            {t('profile.confirmPassword')}
                            <input
                              ref={inputRefs.confirmPassword}
                              className={cx({ isError: errors.confirmPassword })}
                              type={showPassword.confirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              placeholder={t('profile.confirmPassword')}
                              value={confirmPassword}
                              onChange={(e) => {
                                handleInputChange(e);
                                validateInputs();
                              }}
                              onBlur={validateInputs}
                            />
                            {confirmPassword && (
                              <div
                                onClick={() => {
                                  handleEyeIconClick('confirmPassword');
                                }}
                              >
                                {!showPassword.confirmPassword ? (
                                  <EyeIcon className={cx('eye-icon')} />
                                ) : (
                                  <HideIcon className={cx('eye-icon')} />
                                )}
                              </div>
                            )}
                          </label>
                          {errors.confirmPassword && (
                            <div className={cx('errors-message')}>{errors.confirmPassword}</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* listOption[1].title là "Personal info" */}
                  {/* nếu đang không thay đổi và phải đang ở trang trang personal info thì mới hiển thị */}
                  {!isChange && selectedOption === listOptions[1].title && (
                    <div className={cx('btn-container')}>
                      <Button
                        className={cx('change-btn')}
                        onClick={() => {
                          setIsChange(true);
                        }}
                      >
                        {t('profile.btn-edit')}
                      </Button>
                    </div>
                  )}

                  {/* listOption[1].title là "Personal info" */}
                  {/* nếu đang thay đổi hoặc không phải là trang personal info thì hiển thị */}
                  {(isChange || selectedOption !== listOptions[1].title) && (
                    <div className={cx('btn-container')}>
                      <Button
                        className={cx('cancel-btn')}
                        onClick={() => {
                          handleCancel();
                          setIsChange(false);
                        }}
                      >
                        {t('profile.btn-cancel')}
                      </Button>
                      <Button
                        className={cx('update-btn')}
                        onClick={(e) => {
                          handleUpdate();
                        }}
                      >
                        {t('profile.btn-update')}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
