from sqlalchemy import create_engine
from logging.config import fileConfig
from alembic import context
from database import DATABASE_URL, Base # Import the existing DB URL
from models import User, Post

# Replace async URL with a sync URL for migrations
SYNC_DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg", "postgresql")

# Create a synchronous engine for migrations
engine = create_engine(SYNC_DATABASE_URL)

config = context.config
config.set_main_option("sqlalchemy.url", SYNC_DATABASE_URL)

# Load logging configuration
if config.config_file_name:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    context.configure(url=SYNC_DATABASE_URL, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = engine.connect()
    with connectable:
        context.configure(connection=connectable, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
