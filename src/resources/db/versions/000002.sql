CREATE OR REPLACE FUNCTION updated_at_column_f()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';

CREATE TABLE users (
    id BIGSERIAL NOT NULL,
    email TEXT NOT NULL,
    avatar TEXT,
    name TEXT,
    contacts JSONB NOT NULL DEFAULT '{}',
    verified_code TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE TRIGGER
    update_users_updated_at_trigger
BEFORE UPDATE ON
    users
FOR EACH ROW EXECUTE PROCEDURE
    updated_at_column_f();
