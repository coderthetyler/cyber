CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    display_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    creation_time INTEGER NOT NULL
);

CREATE TABLE failed_login_attempts (
    id INTEGER PRIMARY KEY,
    attempt_time INTEGER NOT NULL,
    source_ip TEXT NOT NULL,
    entered_username TEXT NOT NULL
);

CREATE TABLE successful_login_attempts (
    id INTEGER PRIMARY KEY,
    attempt_time INTEGER NOT NULL,
    source_ip TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id)
);

CREATE TABLE buckets (
    id INTEGER PRIMARY KEY,
    display_name TEXT NOT NULL,
    display_description TEXT NOT NULL
);

CREATE TABLE units (
    id INTEGER PRIMARY KEY,
    display_name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    digits INTEGER NOT NULL
);

CREATE TABLE unit_exchange_rates (
    id INTEGER PRIMARY KEY,
    effective_time INTEGER NOT NULL,

    source_unit_id INTEGER NOT NULL REFERENCES units(id),
    source_unit_amount INTEGER NOT NULL,

    target_unit_id INTEGER NOT NULL REFERENCES units(id),
    target_unit_amount INTEGER NOT NULL
);

CREATE TABLE transfers (
    id INTEGER PRIMARY KEY,
    justification TEXT,

    source_bucket_id INTEGER NOT NULL REFERENCES buckets(id),
    source_unit_id INTEGER REFERENCES units(id),
    source_bucket_amount INTEGER NOT NULL,
    source_withdraw_time INTEGER NOT NULL,

    target_bucket_id INTEGER NOT NULL REFERENCES buckets(id),
    target_unit_id INTEGER REFERENCES units(id),
    target_bucket_amount INTEGER NOT NULL,
    target_deposit_time INTEGER NOT NULL
);

CREATE TABLE vendors (
    id INTEGER PRIMARY KEY,
    bucket_id INTEGER NOT NULL REFERENCES buckets(id)
);

CREATE TABLE jobs (
    id INTEGER PRIMARY KEY,
    company_name TEXT,
    position_name TEXT,
    position_description TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT,
    bucket_id INTEGER NOT NULL REFERENCES buckets(id)
);

CREATE TABLE paystubs (
    id INTEGER PRIMARY KEY,
    creation_time INTEGER NOT NULL,
    from_date TEXT NOT NULL,
    thru_date TEXT NOT NULL,
    deposit_date TEXT NOT NULL,
    job_id INTEGER NOT NULL REFERENCES jobs(id)
);

CREATE TABLE paystub_transfers (
    id INTEGER PRIMARY KEY,
    paystub_id INTEGER NOT NULL REFERENCES paystubs(id),
    transfer_id INTEGER NOT NULL REFERENCES transfers(id)
);

CREATE TABLE paystub_attachments (
    id INTEGER PRIMARY KEY,
    upload_time INTEGER NOT NULL,
    paystub_id INTEGER NOT NULL REFERENCES paystubs(id),
    file_path TEXT NOT NULL
);

CREATE TABLE time_entries (
    id INTEGER PRIMARY KEY,
    creation_time INTEGER NOT NULL,
    start_time INTEGER NOT NULL,
    end_time INTEGER NOT NULL,
    description TEXT NOT NULL,
    job INTEGER REFERENCES jobs(id)
);

CREATE TABLE accounts (
    id INTEGER PRIMARY KEY,
    institute_name TEXT,
    account_number INTEGER,
    open_date TEXT NOT NULL,
    close_date TEXT,
    bucket_id INTEGER NOT NULL REFERENCES buckets(id)
);

CREATE TABLE statements (
    id INTEGER PRIMARY KEY,
    upload_time INTEGER NOT NULL,
    issue_date TEXT NOT NULL,
    from_date TEXT NOT NULL,
    thru_date TEXT NOT NULL,
    account_id INTEGER NOT NULL REFERENCES accounts(id)
);

CREATE TABLE statement_transfers (
    id INTEGER PRIMARY KEY,
    statement_id INTEGER NOT NULL REFERENCES statements(id),
    transfer_id INTEGER NOT NULL REFERENCES transfers(id)
);

CREATE TABLE statement_accounts {
    id INTEGER PRIMARY KEY,
    statement_id INTEGER NOT NULL REFERENCES statements(id),
    account_id INTEGER NOT NULL REFERENCES accounts(id)
}

CREATE TABLE statement_attachments (
    id INTEGER PRIMARY KEY,
    upload_time INTEGER NOT NULL,
    statement_id INTEGER NOT NULL REFERENCES statements(id),
    file_path TEXT NOT NULL
);
