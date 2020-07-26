CREATE OR REPLACE FUNCTION updated_at_column_f()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';

CREATE TABLE user_card (
    id BIGSERIAL NOT NULL,
    user_id BIGINT NOT NULL,
    public_id UUID NOT NULL DEFAULT uuid_generate_v1(),
    city_id INTEGER NOT NULL,
    contacts JSONB NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT pk_user_card PRIMARY KEY (id),
    CONSTRAINT fk_user_card_city_id_city FOREIGN KEY(city_id) REFERENCES city (id),
    CONSTRAINT fk_user_card_user_id_users FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE INDEX user_card_public_id_idx ON user_card (public_id);
CREATE INDEX user_card_lower_name_gin_idx ON user_card USING GIN (lower(name) gin_trgm_ops);

CREATE TRIGGER
    update_user_card_updated_at_trigger
BEFORE UPDATE ON
    user_card
FOR EACH ROW EXECUTE PROCEDURE
    updated_at_column_f();
