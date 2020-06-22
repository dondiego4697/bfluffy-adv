CREATE TABLE users (
    id BIGSERIAL NOT NULL,
    email TEXT NOT NULL,
    display_name TEXT NOT NULL,
    password TEXT NOT NULL,
    sign_up_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    verified BOOLEAN DEFAULT FALSE NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email)
);
