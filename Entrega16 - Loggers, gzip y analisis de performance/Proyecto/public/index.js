const socket = io();
let arr_prodscart = [];
let arr_prodsHome = [];
let navigateLenght = 0;
if (location.pathname === "/") {
  socket.on("prodsHome_back", (data) => {
    socket.emit("prodsHome_client", "Estoy leyendo productos!");
    navigateLenght = data.filter((c) => c.check === true).length || 0;
    renderProdsHome(data);
  });
  const renderProdsHome = (data) => {
    arr_prodsHome = data;
    const html = `

    <div class="px-4 py-4  grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    ${data
      .map((prod) => {
        return `
    <div class="card transition-all w-full">
        <div class="w-full h-[430px] bg-purple-300">
          <img class="w-full h-full" src="${prod.imageurl}" alt="">
        </div>
        <div class="p-4 flex flex-col gap-4">
            <div class="flex pb-2 gap-4 w-full justify-between text-center items-center">
                <h3 class="text-gray-600 w-full text-base">
                    <span class="uppercase text-base font-semibold">${
                      prod.nombre
                    }</span>
                </h3>
            </div>
            <div class="flex justify-center items-center relative text-center">
                <p>
                    <span class="font-bold text-xl">
                        $ ${prod.precio}
                    </span>
                </p>
            </div>
            <div class="w-full flex items-center justify-center">
                ${
                  prod.check
                    ? `
                <button class="bg-red-500 whitespace-nowrap uppercase text-sm text-white rounded-sm px-2 py-1"
                    title="Agregar producto al carrito" onclick="return deleteProd_xcarro('${prod.id}')">
                    Eliminar del carrito
                </button>
                `
                    : `
                <button class="bg-purple-500 uppercase text-sm text-white rounded-sm px-2 py-1"
                    title="Agregar producto al carrito" onclick="return addProd_xcarro('${prod.id}')">
                    Agregar al carrito
                </button>
                `
                }
                
                
            </div>
        </div>
    </div>
  `;
      })
      .join(" ")}
  </div>
    `;
    document.querySelector("#gridprods").innerHTML = html;
  };
} else if (location.pathname === "/productos") {
  // Chat functions
  socket.on("mensage_back", (data) => {
    socket.emit("message_client", "Estoy conectado, soy el cliente!");
    if (!data.error) {
      renderChat(data);
    } else {
      goLink(`/session/login/?Mesage=${data.error}`);
    }
  });

  socket.on("productlist_back", (data) => {
    renderProd(data);
    socket.emit("productlist_client", "Estoy leyendo el listado de productos!");
  });

  const renderChat = (data) => {
    const html = `
      <div id="overf" class="flex flex-col gap-1 absolute bottom-0 max-h-[19.3rem] overflow-auto w-full">
        ${data
          .map((x) => {
            return `
            <p> <span class="text-[${x.color}] text-[14px] font-bold">${x.nombre}</span> <span class="text-[11px]">[${x.feccarga}]</span> : <span class="text-[14px] font-bold text-green-600">${x.msn}</span> </p>
      `;
          })
          .join(" ")}
      </div>
    `;
    document.querySelector("#caja").innerHTML = html;
    setTimeout(() =>
      document
        .querySelector("#overf")
        .scrollTo(0, document.querySelector("#overf").scrollHeight)
    );
  };

  const renderProd = (data) => {
    const html = `
    <article class="overflow-x-auto w-full">
    <div class="min-w-screen flex items-center justify-center bg-gray-100 font-sans overflow-hidden">
        <div class="w-full">
            <div class="bg-white m-4 shadow-md rounded">
                <table class="min-w-max w-full table-auto">
                    <thead class="block">
                        <tr class="bg-purple-200 text-gray-600 uppercase text-sm leading-normal">
                            <th class="py-3 px-6 text-left"></th>
                            <th class="py-3 px-6 text-left">Codigo</th>
                            <th class="py-3 px-6 text-left">Nombre</th>
                            <th class="py-3 px-6 text-left">Precio</th>
                            <th class="py-3 px-6 text-left">Stock</th>
                            <th class="py-3 px-6 text-left">Descripcion</th>
                            <th class="py-3 px-6 text-left flex justify-center">Acciones</th>
                        </tr>
                    </thead>
                      <tbody class="text-gray-600 text-sm font-light block overflow-y-auto">
                      ${data
                        .map((prod) => {
                          return ` 
                        <tr class="border-b border-gray-200 hover:bg-gray-100">
                              <td class="text-left whitespace-nowrap flex items-center justify-center">
                                  <div class="">
                                      <div class="mr-2 w-8 h-8">
                                          <img class="w-full h-full" src="${prod.imageurl}?${prod.id}" />
                                      </div>
                                  </div>
                              </td>
                              <td class="text-left pl-[22px]">
                                  <span>${prod.codigo}</span>
                              </td>
                              <td class="text-left pl-[22px]">
                                  <span>${prod.nombre}</span>
                              </td>
                              <td class="text-center pl-[22px]">
                                  <span>${prod.precio}</span>
                              </td>
                              <td class="text-center pl-[22px]">
                                 <span>${prod.stock}</span>
                              </td>
                              <td class="text-center pl-[22px] max-w-[16rem] overflow-hidden">
                                  <div class="flex items-center justify-center">
                                      <span class="whitespace-pre">${prod.descripcion}</span>
                                  </div>
                              </td>
                              <td class="text-center justify-center">
                                  <div class="flex item-center justify-center">
                                      <div
                                          class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer">
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                              stroke="currentColor">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                          </svg>
                                      </div>
                                      <button class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer"
                                          onclick="return deleteProducto('${prod.id}')">
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                              stroke="currentColor">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                      </button>
                                  </div>
                              </td>
                          </tr>
                      `;
                        })
                        .join(" ")}                      
                      </tbody>
                </table>
            </div>
        </div>
      </div>
    </article>
    `;
    const htmlnoitems = `
    <div class="w-full text-center">
      <h1 class="font-bold text-4xl text-purple-600">No hay productos en la lista</h1>
      <h2 class="font-medium text-xl text-purple-400 mt-4">¡Agrega el primero y empeza a interactuar!</h2>
    </div>
  `;
    if (data.length > 0) document.querySelector("#table").innerHTML = html;
    if (data.length === 0)
      document.querySelector("#table").innerHTML = htmlnoitems;
  };
}

// socket.on("lenghtCard_back", (data) => {
//   navigateLenght = data;
//   socket.emit("lenghtCard_client", "Estoy leyendo productos!");
//   renderLenghtCard();
// });
const renderLenghtCard = () => {
  const html = `
  <span> ${navigateLenght} </span>
  `;
  document.querySelector("#lenghtCard").innerHTML = html;
};

const deleteProducto = async (id) => {
  var url = `/productos/${id}?${location.search.replace("?", "")}`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const re = await fetch(url, options);
  if (!re.ok) {
    const corte = re.url.split("/session/login/")[1];
    const path = `/session/login/${corte}`;
    goLink(path); 
  }

};

const addProd_xcarro = async (id) => {
  var url = `/carrito/601/productos`;
  const prod = arr_prodsHome.find((e) => e.id === id);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(prod)
  };
  const re = await fetch(url, options);
  if (re.ok) {
    if(re.url.split('?Mesage=').length > 1){
      const corte = re.url.split('/session/login/')[1];
      const path = `/session/login/${corte}`;
      goLink(path);
    }
    navigateLenght += 1;
    renderLenghtCard();
  }
};

const deleteProd_xcarro = async (idprod) => {
  var url = `/carrito/601/productos/${idprod}`;
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const re = await fetch(url, options);
  if (re.ok) {
    if(re.url.split('?Mesage=').length > 1){
      const corte = re.url.split('/session/login/')[1];
      const path = `/session/login/${corte}`;
      goLink(path);
    }
    navigateLenght += 1;
    renderLenghtCard();
  }
};


const goLink = (link) => {
  window.location.replace(link + location.search);
};