(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const t of o)if(t.type==="childList")for(const r of t.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function s(o){const t={};return o.integrity&&(t.integrity=o.integrity),o.referrerPolicy&&(t.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?t.credentials="include":o.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(o){if(o.ep)return;o.ep=!0;const t=s(o);fetch(o.href,t)}})();class a extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"})}connectedCallback(){this.loadData().then(()=>this.render())}async loadData(){this.data={title:"GameXop",image:{url:"http://localhost:5175/public/logo.svg",alt:"Logo de GameXop"}}}render(){this.shadow.innerHTML=`
    <style>
      .not-found{
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        height: 100vh;
        width: 100%;
      }

      .not-found img{
        height: 10rem;
        width: 10rem;
      }

      .not-found h1{
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 3rem;
        font-weight: 700;
        margin: 0;
        text-shadow: 2px 0 0 hsl(284deg 100% 50%), -2px 0 0 hsl(284deg 100% 50%), 0 2px 0 hsl(284deg 100% 50%), 0 -2px 0 hsl(284deg 100% 50%), 1px 1px hsl(284deg 100% 50%), -1px -1px 0 hsl(284deg 100% 50%), 1px -1px 0 hsl(284deg 100% 50%), -1px 1px 0 hsl(284deg 100% 50%);
      }

      .not-found p{
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 1.5rem;
        font-weight: 400;
        margin: 1rem;
      }

      .not-found a{
        background-color: hsl(284deg 100% 50%);
        border-radius: 0.5rem;
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 1.2rem;
        font-weight: 400;
        padding: 1rem 2rem;
        text-decoration: none;
      }
    </style>

    <div class="not-found">
      <img src="${this.data.image.url}" alt="${this.data.image.alt}" />
      <h1>${this.data.title}</h1>
      <p>La página que buscas no existe</p>
      <a href="/">Volver al inicio</a>
    </div>
    `,this.shadow.querySelector("a").addEventListener("click",e=>{e.preventDefault(),window.history.pushState({},"","/"),window.dispatchEvent(new PopStateEvent("popstate"))})}}customElements.define("notfound-component",a);class l extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.basePath=this.getAttribute("base-path")||""}connectedCallback(){this.render(),window.onpopstate=()=>this.handleRouteChange()}handleRouteChange(){this.render()}render(){const e=window.location.pathname;this.getTemplate(e)}async getTemplate(e){const n={"/cliente/login":"login.html","/cliente/login/reset":"reset.html"}[e]||"404.html";await this.loadPage(n)}async loadPage(e){const n=await(await fetch(`${this.basePath}/pages/${e}`)).text();document.startViewTransition(()=>{this.shadowRoot.innerHTML=n,document.documentElement.scrollTop=0})}}customElements.define("page-component",l);class c extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"});const e=document.createElement("link");e.href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap",e.rel="stylesheet",document.head.appendChild(e)}}customElements.define("font-loader-component",c);class d extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"})}static get observedAttributes(){}connectedCallback(){this.render()}attributeChangedCallback(e,s,n){}render(){this.shadow.innerHTML=`
      <style>
          h2 {   
              color: hsl(0, 0%, 100%);
              font-family: 'Roboto', sans-serif;
              font-size: 2em;
              font-weight: 600;
              margin: 0;
              text-decoration: none;
          }
      </style>

      <h2>${this.getAttribute("title")}</h2>
      `}}customElements.define("logo-component",d);class m extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"})}connectedCallback(){this.checkSignin(),this.render()}async checkSignin(){const e="https://carlosseda.com";try{const s=await fetch(`${e}/api/auth/customer/check-signin`,{headers:{"Content-Type":"application/json",Authorization:"Bearer "+localStorage.getItem("customerAccessToken")}});if(s.ok){const n=await s.json();window.location.href=n.redirection}}catch(s){console.log(s)}}render(){this.shadow.innerHTML=`
        <style>

          :host{
            display: block;
            width: 300px;
          }

          .login-form{
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          h2{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-size: 1.5rem;
            font-weight: 600;
            text-align: center;
          }

          form{
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }

          .form-element{
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
          }

          .form-element-label label{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-weight: 600;
            font-size: 1rem;
            transition: color 0.5s;
          }

          .form-element-input{
            width: 100%;
          }

          .form-element-input input{
            background-color:hsl(226, 63%, 45%);
            border: none;
            border-bottom: 0.1rem solid  hsl(0, 0%, 100%);
            box-sizing: border-box;
            color: hsl(0, 0%, 100%);
            font-family: 'Roboto' , sans-serif;
            font-weight: 600;
            outline: none;
            padding: 0.5rem;
            width: 100%;
          }

          .form-submit{
            background-color: hsl(272 40% 35%);
            border: none;
            border-radius: 0.5rem;
            color: hsl(0, 0%, 100%);
            cursor: pointer;
            font-family: 'Lato', sans-serif;
            font-size: 1rem;      
            margin-top: 1rem;      
            padding: 0.5rem 1rem;
          }

          .form-submit:hover {
            filter: brightness(1.2);
          }

          .reset{
            display: flex;
            justify-content: center;
            width: 100%;
          }

          a{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-size: 1.2rem;
            font-weight: 600;
            text-decoration: none;
          }
        </style>

        <div class="login-form">
          <h2>${this.getAttribute("title")}</h2>

          <form class="form">
            <div class="form-element">
              <div class="form-element-label">
                <label for="email">Email</label>
              </div>
              <div class="form-element-input">
                <input type="email" name="email" id="email" required>
              </div>
            </div>
            <div class="form-element">
              <div class="form-element-label">
                <label for="password">Password</label>
              </div>
              <div class="form-element-input">
                <input type="password" name="password" id="password" required>
              </div>
            </div>
            <button type="submit" class="form-submit">Enviar</button>
          </form>

          <div class="reset">
            <a href="/cliente/login/reset">Olvidé mi contraseña</a>
          </div>
        </div>
        `;const e=this.shadow.querySelector("form");e.addEventListener("submit",s=>{s.preventDefault(),this.submitForm(e)})}async submitForm(e){const s="https://carlosseda.com",n=new FormData(e),o=Object.fromEntries(n.entries());try{const t=await fetch(`${s}/api/auth/customer/signin`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(t.ok){const r=await t.json();localStorage.setItem("customerAccessToken",r.customerAccessToken),window.location.href=r.redirection}else{const r=await t.json();console.log(r.message)}}catch(t){console.log(t)}}}customElements.define("login-form-component",m);class h extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"})}connectedCallback(){this.render()}render(){this.shadow.innerHTML=`
        <style>

          :host{
            display: block;
            width: 300px;
          }

          h2{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-size: 1.5rem;
            font-weight: 600;
            text-align: center;
          }

          form{
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }

          .form-element{
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
          }

          .form-element-label label{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-weight: 600;
            font-size: 1rem;
            transition: color 0.5s;
          }

          .form-element-input{
            width: 100%;
          }

          .form-element-input input{
            background-color:hsl(226, 63%, 45%);
            border: none;
            border-bottom: 0.1rem solid  hsl(0, 0%, 100%);
            box-sizing: border-box;
            color: hsl(0, 0%, 100%);
            font-family: 'Roboto' , sans-serif;
            font-weight: 600;
            outline: none;
            padding: 0.5rem;
            width: 100%;
          }

          .form-submit{
            background-color: hsl(272 40% 35%);
            border: none;
            border-radius: 0.5rem;
            color: hsl(0, 0%, 100%);
            cursor: pointer;
            font-family: 'Lato', sans-serif;
            font-size: 1rem;      
            margin-top: 1rem;      
            padding: 0.5rem 1rem;
          }

          .form-submit:hover {
            filter: brightness(1.2);
          }
        </style>

        <h2>${this.getAttribute("title")}</h2>

        <form class="form">
          <div class="form-element">
            <div class="form-element-label">
              <label for="email">Email</label>
            </div>
            <div class="form-element-input">
              <input type="email" name="email" id="email" required>
            </div>
          </div>
          <button type="submit" class="form-submit">Enviar</button>
        </form>
        `;const e=this.shadow.querySelector("form");e.addEventListener("submit",s=>{s.preventDefault(),this.submitForm(e)})}async submitForm(e){const s="https://carlosseda.com",n=new FormData(e),o=Object.fromEntries(n.entries());try{const t=await fetch(`${s}/api/auth/customer/reset`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(t.ok){const r=await t.json();console.log(r)}else{const r=await t.json();console.log(r.message)}}catch(t){console.log(t)}}}customElements.define("reset-form-component",h);
