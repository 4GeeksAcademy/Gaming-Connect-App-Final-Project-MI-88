"""user profile fields

Revision ID: b2c4_user_prof
Revises: 0763d677d453
Create Date: 2026-04-06

"""
from alembic import op
import sqlalchemy as sa


revision = 'b2c4_user_prof'
down_revision = '0763d677d453'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('first_name', sa.String(length=80), nullable=True))
        batch_op.add_column(sa.Column('last_name', sa.String(length=80), nullable=True))
        batch_op.add_column(sa.Column('date_of_birth', sa.String(length=32), nullable=True))
        batch_op.add_column(sa.Column('user_name', sa.String(length=80), nullable=True))
        batch_op.create_unique_constraint('uq_user_user_name', ['user_name'])


def downgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_constraint('uq_user_user_name', type_='unique')
        batch_op.drop_column('user_name')
        batch_op.drop_column('date_of_birth')
        batch_op.drop_column('last_name')
        batch_op.drop_column('first_name')
