import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import style from './HistoryOderItem.module.scss';

import { StoreIcon } from '../Icons';
import Button from '../Button';
import formatDateTime from '~/utils/formatDateTime';
import { useDispatch } from 'react-redux';
import { cancelOrder } from '~/apiService/orderSevice';
import { toast } from 'react-toastify';
import { deleteOrder as cancel } from '~/features/orderSlice';

const cx = classNames.bind(style);

function HistoryOderItem({ data }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleCancelOrder = () => {
    dispatch(cancelOrder(data?._id)).then((result) => {
      if (result.payload.code === 200) {
        toast.success(result.payload.message);

        //khi người dùng xóa thành công thì distpatch id đơn hàng để cập nhật lại danh sách đơn hàng
        dispatch(cancel(data?._id));
      } else {
        toast.error(result.payload.message);
      }
    });
  };

  const handleStatus = (status) => {
    if (!status) return;

    if (status === 'pending') {
      return { status: t('historyOrder.statusPending'), color: 'green' };
    } else if (status === 'canceled') {
      return { status: t('historyOrder.statusCanceled'), color: 'red' };
    } else if (status === 'confirmed') {
      return { status: t('historyOrder.statusConfirmed'), color: 'green' };
    } else if (status === 'reject') {
      return { status: t('historyOrder.statusRejected'), color: 'red' };
    } else if (status === 'shipping') {
      return { status: t('historyOrder.statusShipping'), color: 'green' };
    } else if (status === 'success') {
      return { status: t('historyOrder.statusSuccess'), color: 'green' };
    }
  };

  const handlePaymentMethods = (method) => {
    if (!method) return;

    if (method === 'cod') {
      return t('checkout.desc02');
    }
    if (method === 'bank') {
      return t('checkout.desc03');
    }
    if (method === 'prepaid') {
      return t('checkout.desc14');
    }
  };

  return (
    <div className={cx('item-wrapper')}>
      <div className={cx('item__shop-info')}>
        <div className={cx('item__shop-name')}>
          <div>
            <StoreIcon />
          </div>
          <div> {data?.shop.fullname} </div>
        </div>
        <div className={cx('item__status', { 'item__status--red': handleStatus(data?.status).color === 'red' })}>
          {handleStatus(data?.status).status}
        </div>
      </div>

      {data?.cartDetails.map((cartDetail, index) => {
        return (
          <div key={index} className={cx('sub-item__info-container')}>
            <img className={cx('sub-item__img')} src={cartDetail.product.image} alt="HaUI Food" />
            <div className={cx('sub-item__info')}>
              <div className={cx('sub-item__name')}>{cartDetail.product.name}</div>
              <div className={cx('sub-item__desc')}>{cartDetail.product.description}</div>
              <div className={cx('sub-item__quantity')}>X {cartDetail.quantity}</div>
              <div className={cx('sub-item__categories')}>{cartDetail.product.categories}</div>
            </div>
            <div className={cx('sub-item__price')}>{cartDetail.product.price.toLocaleString('vi-VI') + ' đ'}</div>
          </div>
        );
      })}

      <div className={cx('address__container')}>
        <div className={cx('address__label')}>{t('historyOrder.label02')}</div>
        <div className={cx('address__value')}>{data?.address} </div>
      </div>

      <div className={cx('note__container')}>
        <div className={cx('note__label')}>{t('historyOrder.label03')}</div>
        <div className={cx('note__value')}>{data?.note} </div>
      </div>

      <div className={cx('date-create__container')}>
        <div className={cx('date-create__label')}>{t('historyOrder.label04')}</div>
        <div className={cx('date-create__value')}>{formatDateTime(data?.createdAt)} </div>
      </div>

      <div className={cx('payment-method__container')}>
        <div className={cx('payment-method__label')}>{t('checkout.title12')}:</div>
        <div className={cx('payment-method__value')}>{data && handlePaymentMethods(data.paymentMethod)}</div>
      </div>

      <div className={cx('total__container')}>
        <div className={cx('total__content')}>
          <div className={cx('total__label')}>{t('historyOrder.label01')}</div>
          <div className={cx('total__value')}>{data?.totalMoney.toLocaleString('vi-VI') + ' đ'}</div>
        </div>
        <Button
          onClick={() => {
            if (data?.status === 'pending') {
              handleCancelOrder();
            }
          }}
          className={cx('total__container-btn')}
          order
          primary
          cancel={data?.status === 'pending'}
        >
          {data?.status === 'pending' ? t('profile.btn-cancel') : t('button.btn18')}
        </Button>
      </div>
    </div>
  );
}

export default HistoryOderItem;
