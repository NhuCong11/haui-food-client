import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import style from "./QuantityDrawer.module.scss";

import Button from "~/components/Button";
import formatCurrency from "~/utils/formatCurrency";
import { getLocalStorageItem } from "~/utils/localStorage";
import { addProductToCart } from "~/apiService/cartService";
import { closeQuantityDrawer } from "~/features/productSlice";
import { CloseIcon, MinusIcon, PlusIcon } from "~/components/Icons";

const cx = classNames.bind(style);

const QuantityDrawer = () => {
  const [quantity, setQuantity] = useState(1);

  const isOpen = useSelector((state) => state.product.isOpenQuantityDrawer);
  const data = useSelector((state) => state.product.updatingQuantityProduct);
  const loading = useSelector((state) => state.cart.loading);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  useEffect(() => {
    setQuantity(1);
  }, [isOpen]);

  const handleCloseDrawer = () => {
    dispatch(closeQuantityDrawer());
  };

  const handleUpdateQuality = (type) => {
    if (type === "minus") {
      if (quantity === 0) {
        return;
      } else {
        setQuantity(quantity - 1);
      }
    }

    if (type === "plus") {
      if (quantity === 100) {
        toast.info(t("quantity-drawer.toast.invalid-quantity"));
        return;
      }
      setQuantity(quantity + 1);
    }
  };

  return (
    <>
      <div
        className={cx("quantity-drawer__overlay", { "quantity-drawer__overlay--show": isOpen })}
        onClick={handleCloseDrawer}
      />

      <div className={cx("quantity-drawer__wrapper", { "quantity-drawer__wrapper--show": isOpen })}>
        <div className={cx("quantity-drawer__header")}>
          <div className={cx("quantity-drawer__header-close")} onClick={handleCloseDrawer}>
            <span>
              <CloseIcon />
            </span>
          </div>

          <div className={cx("quantity-drawer__product-container")}>
            <img className={cx("quantity-drawer__product-img")} src={data?.image} alt={data?.name} />

            <div className={cx("quantity-drawer__product-info")}>
              <div className={cx("quantity-drawer__product-name")}>{data?.name}</div>
              <div className={cx("quantity-drawer__product-desc")}>{data?.description}</div>
            </div>

            <div className={cx("quantity-drawer__product-price")}>{formatCurrency(data?.price)}</div>
          </div>
        </div>

        <div
          className={cx("quantity-drawer__footer")}
          style={{
            pointerEvents: loading ? "none" : "",
          }}
        >
          <div className={cx("quantity-drawer__quantity-container")}>
            <div
              className={cx("quantity-drawer__quantity-minus")}
              onClick={() => {
                handleUpdateQuality("minus");
              }}
            >
              <MinusIcon />
            </div>

            <div className={cx("quantity-drawer__quantity-value")}>{quantity}</div>

            <div
              className={cx("quantity-drawer__quantity-plus")}
              onClick={() => {
                handleUpdateQuality("plus");
              }}
            >
              <PlusIcon />
            </div>
          </div>

          <Button
            primary
            disabled={loading}
            className={cx("quantity-drawer__add-btn")}
            style={{
              backgroundColor: quantity === 0 ? "#ee6352" : "",
              border: quantity === 0 ? "1px solid #ee6352" : "",
            }}
            onClick={() => {
              if (quantity === 0) {
                handleCloseDrawer();
              } else {
                if (getLocalStorageItem("user")) {
                  dispatch(addProductToCart({ product: data?._id, quantity: quantity })).then((result) => {
                    if (result.payload.code === 200) {
                      toast.success(result.payload.message);
                      handleCloseDrawer();
                    } else {
                      handleCloseDrawer();
                      toast.error(result.payload.message);
                    }
                  });
                } else {
                  toast.info(t("quantity-drawer.toast.unauthorized"));
                }
              }
            }}
          >
            {quantity > 0
              ? `${t("quantity-drawer.add-to-cart")} ${formatCurrency(data?.price * quantity)}`
              : `${t("quantity-drawer.cancel")}`}
          </Button>
        </div>
      </div>
    </>
  );
};

export default QuantityDrawer;
