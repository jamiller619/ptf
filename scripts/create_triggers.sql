CREATE TRIGGER notify_node
  AFTER INSERT OR UPDATE OR DELETE
  ON nodes
  FOR EACH ROW
  EXECUTE PROCEDURE notify_trigger(
    'id',
    'name',
    'lower_bound',
    'upper_bound',
    'children_length',
    'times_generated'
  );