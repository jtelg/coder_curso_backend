import logger from "../loggerUtils.js";
import transporter from "./transport.js";
import dotenv from "../dotenvUtils.js";

const sender = (subject, html) => {
  const mailOptions = {
    from: "Servidor node.js",
    to: process.env.EMAIL_ADMIN,
    subject,
    html,
  };
  try {
    const info = transporter
      .sendMail(mailOptions)
      .then((info) => {
        logger.info(`SEND > Email de registro enviado - sendMail.js:33`);
      })
      .catch((error) => {
        logger.error(`ERROR > al enviar email de usuario ${JSON.stringify(error)}- sendMail.js:33`);
      });
  } catch (error) {
    logger.error(`ERROR > al enviar email de usuario - sendMail.js:36`);
  }
};

const uses = {
  nuevoRegistro_datosuser: (req) => {
    const objUser = req.body;
    let txt = ``;
    for (const key in objUser) {
      if (Object.hasOwnProperty.call(objUser, key)) {
        const value = objUser[key];
        if (key !== "password") {
          txt += `<div style="display: flex; gap:0.2rem;">
                      <p style="font-weight: bold; margin:0; text-transform: capitalize;">${key}:</p>
                      <p style="margin: 0;">${value}</p> 
                  </div>
              `;
        }
      }
    }
    return txt;
  },
  nuevaCompra_datosuser: (req) => {
    const objUser = req.body.user;
    let txt = ``;
    for (const key in objUser) {
      if (Object.hasOwnProperty.call(objUser, key)) {
        const value = objUser[key];
        if (key !== "password" && key !== 'id' && key !== 'timestamp' && key !== 'feccarga') {
          txt += `<div style="display: flex; gap:0.2rem;">
                      <p style="font-weight: bold; margin:0; text-transform: capitalize;">${key}:</p>
                      <p style="margin: 0;">${value}</p> 
                  </div>
              `;
        }
      }
    }
    return txt;
  },
  nuevaCompra_datosprod: (productos) => {
    let txt = ``;
    productos.forEach(prod => {
      txt += `<li> ${prod.nombre} x $ ${prod.precio}</li>`;
    });
    return txt;
  },
  nuevaCompra_setTotal: (productos) => {
    return productos.reduce((a, b) => a + b.precio, 0).toLocaleString('de');
  }
};

const sendMail = {
  nuevoRegistro: (req) => {
    const html = `
    <div>
      <div style="padding: 1rem; display:block;">
          <h1 style="font-weight: bold; font-size: 18px">¡Se registro un nuevo usuario en la demo!</h1>
          <h2 style="font-size: 16px;">Los datos de registro son los siguientes:</h2>
      </div>
      <div style="padding: 0rem 1rem;">
          <div style="display: block;">
              ${uses.nuevoRegistro_datosuser(req)}
          </div>
      </div>
    </div>
    `;
    sender('Nuevo registro', html);
  },
  nuevaCompra: (req) => {
    const productos = req.body.carro.productos;
    const html = `
    <div style="max-width: 390px;">
      <div style="padding: 1rem; display:block;">
          <h1 style="font-weight: bold; font-size: 18px">¡Se registro un nueva compra en la demo!</h1>
          <h2 style="font-size: 16px;">Los datos de la misma son:</h2>
      </div>
      <div style="padding: 0rem 1rem;">
          <div style="display: block;">
              <h1>
                  <span style="text-decoration: underline; font-weight: bold;">Cliente:</span>
                  <span style="font-size: 12px;"> datos del cliente registrado</span>
              </h1>
              <div style="display: block;">
                  ${uses.nuevaCompra_datosuser(req)}
              </div>
          </div>
          <div style="display: block; margin-top: 1rem;">
              <h1>
                  <span style="text-decoration: underline; font-weight: bold;">Productos:</span>
                  <span style="font-size: 12px;"> listado de productos requeridos</span>
              </h1>
              <ul style="display: block; margin-top: .5rem;">
                ${uses.nuevaCompra_datosprod(productos)}
              </ul>
          </div>
          <div style="display: block; width: 100%; margin-top: 2rem;">
              <h1 style="text-align: right;">
                  <span style="font-size: 14px">con un <b>TOTAL</b> de:</span>
                  <span style="font-weight: bold;"> $ ${uses.nuevaCompra_setTotal(productos)}</span>
              </h1>
          </div>
      </div>
    </div>
    `;
    sender(`Nuevo pedido de ${req.body.user.nombre} - ${req.body.user.email}`, html);
  },
};

export default sendMail;
