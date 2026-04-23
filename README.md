# 🚀 Social Media Analytics Dashboard

![React](https://img.shields.io/badge/Frontend-React-blue)
![Flask](https://img.shields.io/badge/Backend-Flask-black)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)
![ML](https://img.shields.io/badge/Machine%20Learning-Regression-green)
![Status](https://img.shields.io/badge/Status-MVP%20Complete-success)

---

## 📊 Descripción

Este proyecto es un **dashboard de analítica de redes sociales** que permite evaluar el rendimiento de publicaciones utilizando un modelo de **Machine Learning (Linear Regression)**.

El sistema procesa métricas como likes, comentarios y shares para generar un **score predictivo** que ayuda a identificar contenido de alto rendimiento.

---

## 🎯 Objetivo del Proyecto

* Aplicar conceptos de **backend + machine learning**
* Construir un sistema **full-stack funcional**
* Simular un entorno real de analítica de redes sociales
* Crear un proyecto sólido para **portafolio profesional**

---

## 🧠 Machine Learning

Se implementa un modelo de **Linear Regression** para calcular un score de engagement.

### Variables de entrada:

* 👍 Likes
* 💬 Comments
* 🔁 Shares

### Fórmula:

```text id="u7b2qf"
Score = (likes * w1) + (comments * w2) + (shares * w3)
```

Los coeficientes (`w1`, `w2`, `w3`) se calculan dinámicamente a partir de los datos almacenados.

---

## ✨ Funcionalidades

### 📌 Dashboard

* Visualización de posts
* Filtros por plataforma (Facebook, Instagram, Twitter)
* Ranking automático por score
* Identificación del mejor post 🏆

### 📈 Analítica

* Gráficas de métricas
* Historial de análisis
* Ejecución de análisis en tiempo real

### ⚡ Experiencia de Usuario

* Estados dinámicos (`Analyzing...`)
* Auto-refresh de datos
* UI reactiva

### 📤 Exportación

* Descarga de reportes en CSV

---

## 🏗️ Arquitectura

```text id="3o1qvy"
Frontend (React + Tailwind)
        ↓
API REST (Flask)
        ↓
Base de datos (MySQL)
        ↓
Modelo ML (Regression)
```

---

## 🛠️ Tecnologías utilizadas

### Frontend

* React (Vite)
* TailwindCSS
* Axios
* Recharts

### Backend

* Flask
* Flask-CORS
* PyMySQL

### Machine Learning

* NumPy
* Scikit-learn (opcional)

### Base de datos

* MySQL

---

## 📂 Estructura del proyecto

```text id="d64w6n"
social-media-analytics-dashboard
│
├── backend
│   ├── app
│   ├── routes
│   ├── services
│   ├── config
│   ├── requirements.txt
│   └── run.py
│
├── frontend
│   ├── src
│   ├── components
│   ├── package.json
│   └── vite.config.js
│
├── database
│   └── schema.sql
│
├── README.md
└── PROJECT_NOTES.md
```

---

## ⚙️ Instalación

### 1️⃣ Clonar repositorio

```bash id="c2b8yx"
git clone https://github.com/tu-usuario/social-media-analytics-dashboard.git
cd social-media-analytics-dashboard
```

---

### 2️⃣ Backend

```bash id="g2m6wq"
cd backend
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
python run.py
```

---

### 3️⃣ Frontend

```bash id="o9p2k7"
cd frontend
npm install
npm run dev
```

---

## 🌐 Endpoints principales

### Posts

* `GET /posts`

### Métricas

* `GET /metrics/<post_id>`
* `POST /metrics`

### Análisis

* `GET /posts/<post_id>/analysis/regression`
* `GET /posts/<post_id>/analysis/history`

---

## 📊 Ejemplo de respuesta

```json id="u1pt4x"
{
  "success": true,
  "data": {
    "coefficients": {
      "likes": 1.0,
      "comments": 2.0,
      "shares": 3.0
    },
    "predicted_score": 85
  },
  "error": null
}
```

---

## 🧪 Aprendizajes clave

* Diseño de APIs REST
* Manejo de estado en React
* Integración frontend-backend
* Visualización de datos
* Implementación de modelos de Machine Learning
* Manejo de CORS
* Manejo de requests asíncronos (Axios)

---

## 🚀 Mejoras futuras

* 🔐 Autenticación de usuarios
* ☁️ Deploy en la nube (Docker + VPS)
* 📊 Modelos ML más avanzados
* 📱 Diseño responsive
* 📈 Comparación entre posts

---

## 📸 Screenshots

> Agrega aquí capturas de tu dashboard (muy importante para portafolio)

---

## 👨‍💻 Autor

Desarrollado por **Joel Masias**

---

## ⭐ Si este proyecto te resulta útil

Considera darle una estrella en GitHub ⭐
