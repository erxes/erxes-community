import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

//erxes
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from '@erxes/ui/src/utils';

// local
import LeftSidebar from './LogLeftSidebar';

type Props = {
  remaindersLog: any;
};

const BarcodeGenerator = (props: Props) => {
  const { remaindersLog } = props;

  const configStored: any = {
    ...{
      row: 1,
      column: 1,
      width: 80,
      height: 100,
      margin: 0,
      date: Date.now(),
      isDate: false,
      isProductName: true,
      productNameFontSize: 11,
      isPrice: true,
      priceFontSize: 11,

      isBarcode: true,
      isBarcodeDescription: false,
      barWidth: 2,
      barHeight: 50,
      barcodeFontSize: 13,
      barcodeDescriptionFontSize: 8,

      isQrcode: true,
      qrSize: 128
    },
    ...JSON.parse(
      localStorage.getItem('erxes_product_barcodeGenerator_config') || '{}'
    )
  };

  if (new Date(configStored.date) < new Date()) {
    configStored.date = Date.now();
  }

  // Hooks
  const [config, setConfig] = useState<any>(configStored);
  const [printElement, setPrintElement] = useState<any>(null);

  useEffect(() => {
    // If config date is in the past
    // Make it today
    const configCopy = { ...config };

    if (dayjs().isAfter(dayjs(config.date), 'date'))
      configCopy.date = Date.now();

    localStorage.setItem(
      'erxes_product_barcodeGenerator_config',
      JSON.stringify(configCopy)
    );

    updatePrint();
  }, [config, remaindersLog]);

  // Functions
  const handleChangeConfig = (key: string, value: any) => {
    const configCopy = { ...config };
    configCopy[key] = value;
    setConfig(configCopy);
  };

  const updatePrint = () => {
    const iframeElement: any = document.getElementById('ifmcontentstoprint');
    const barcode: any = document.getElementById('barcode');
    const qrcode: any = document.getElementById('qrcode');

    let printContentHTML = '';

    printContentHTML += `
      <div style="
        display: flex;
        flex-direction: column;
        width: 100vw;
        align-items: center;
        justify-content: center;
        font-family: 'Arial';
      ">
    `;

    for (let index = 1; index <= config.row; index++) {
      // BarcodeRow
      printContentHTML += `<div style="
          display: flex;
          align-items: center;
          justify-content: center;
        ">`;

      for (let index = 1; index <= config.column; index++) {
        // BarcodeItem
        printContentHTML += `
          <div style="
            width: ${config.width}mm;
            height: ${config.height}mm;
            margin: ${config.margin}mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: white;
          ">`;

        if (config.isBarcode) {
          printContentHTML += barcode.innerHTML;
        }

        if (config.isQrcode) {
          printContentHTML += qrcode.innerHTML;
        }

        if (config.isDate && config.date)
          printContentHTML += `
            <div style="
              width: 100%;
              text-align: center;
              margin-top: 5px;
              font-size: ${config.priceFontSize}px !important;
            ">
              ${__('Price')}: ${dayjs(config.date).format('YYYY-MM-DD :HH')}
            </div>
          `;

        printContentHTML += `</div>`;
      }

      printContentHTML += `</div>`;
    }

    printContentHTML += `</div>`;

    iframeElement.contentWindow.document.body.innerHTML = printContentHTML;

    setPrintElement(iframeElement);
  };

  const handlePrint = () => {
    if (printElement) {
      printElement.contentWindow.focus();
      printElement.contentWindow.print();
    }
  };

  const breadcrumb = [
    { title: __('Settings'), link: '/settings' },
    { title: __('Product & Service'), link: '/settings/product-service' },
    { title: __('Barcode Generator') }
  ];

  const content = (
    <>
      <iframe
        id="ifmcontentstoprint"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          outline: 'none',
          backgroundColor: '#F0F0F0'
        }}
      />
    </>
  );

  return (
    <Wrapper
      header={<Wrapper.Header title={'title'} breadcrumb={breadcrumb} />}
      leftSidebar={
        <LeftSidebar
          config={config}
          handleChangeConfig={handleChangeConfig}
          handlePrint={handlePrint}
        />
      }
      content={content}
      transparent={true}
    />
  );
};

export default BarcodeGenerator;
