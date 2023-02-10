use axum::{
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
    extract::State,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use sqlx::sqlite::SqlitePool;

#[derive(Clone)]
struct AppState {
    dbpool: SqlitePool,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    
    tracing::debug!("connecting to db...");
    let dbpool = SqlitePool::connect("sqlite:cyber.db").await.unwrap();
    tracing::debug!("connected to db!");

    let state = AppState {
        dbpool,
    };

    let app = Router::new()
        .route("/users/list", get(list_users))
        .route("/users/create", post(create_user))
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8081));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}


async fn list_users(State(state): State<AppState>) -> impl IntoResponse {
    let users = sqlx::query_as::<_,User>(
            "SELECT id, display_name, password_hash FROM users ORDER BY id")
        .fetch_all(&state.dbpool)
        .await
        .unwrap();
    (StatusCode::OK, Json(users))
}

async fn create_user(State(state): State<AppState>, Json(payload): Json<CreateUser>) -> impl IntoResponse {
    let mut conn = state.dbpool.acquire().await.unwrap();
    let user_id = sqlx::query(
            "INSERT INTO users ( display_name, password_hash ) VALUES ( ?1, ?2 )")
        .bind(payload.display_name)
        .bind(payload.password)
        .execute(&mut conn)
        .await
        .unwrap()
        .last_insert_rowid();
    let user = sqlx::query_as::<_, User>(
            "SELECT * FROM users WHERE id = ?1")
        .bind(user_id)
        .fetch_one(&mut conn)
        .await
        .unwrap();
    (StatusCode::CREATED, Json(user))
}


#[derive(Serialize, sqlx::FromRow)]
struct User {
    id: i64,
    display_name: String,
    password_hash: String,
}

#[derive(Serialize)]
struct UserList {
    user_list: Vec<User>,
}

#[derive(Deserialize)]
struct CreateUser {
    display_name: String,
    password: String,
}